const api = require('./api');

class DeviceZone {

    constructor(master, children = []) {
        this.children = new Set();
        this.master = master;
        children.forEach(c => this.children.add(c));
    }

    async create(children = []) {
        if (!children.length === 0 && this.children.size === 0) {
            throw new Error('no children for group');
        }

        children.forEach(c => this.children.add(c));

        await api.setZone(this.master.address, this.buildPayload(this.master, Array.from(this.children)));
        this.master.inZone = true;
        this.master.isMaster = true;
        this.children.forEach(c => c.inZone = true);
    }

    async add(device) {
        if (this.children.has(device)) return;

        await api.addZoneSlave(this.master.address, this.buildPayload(this.master, [device]));
        device.inZone = true;
    }

    async remove(device) {
        if (!this.children.has(device)) return;

        await api.removeZoneSlave(this.master.address, this.buildPayload(this.master, [device]));

        device.inZone = false;
        this.children.delete(device);
    }

    buildPayload(master, members) {
        return `
            <zone master="${master.macAddress}">
                ${members.map(child => {
                    return `<member ipaddress="${child.address}">${child.macAddress}</member>`
                })}
            </zone>
        `;
    }
}

module.exports = DeviceZone;
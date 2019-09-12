import * as api from './api';
import Device from './Device';

export default class DeviceZone {
    master: Device;
    children: Set<Device>;

    constructor(master: Device, children: Device[] = []) {
        this.children = new Set();
        this.master = master;
        children.forEach(c => this.children.add(c));
    }

    async create(children: Device[] = []) {
        if (children.length === 0 && this.children.size === 0) {
            throw new Error('no children for group');
        }

        children.forEach(c => this.children.add(c));

        await api.setZone(this.master.address, this.buildPayload(this.master, Array.from(this.children)));
    }

    async add(device: Device) {
        if (this.children.has(device)) return;

        await api.addZoneSlave(this.master.address, this.buildPayload(this.master, [device]));
    }

    async remove(device: Device) {
        if (!this.children.has(device)) return;

        await api.removeZoneSlave(this.master.address, this.buildPayload(this.master, [device]));
        this.children.delete(device);
    }

    buildPayload(master: Device, members: Device[]) {
        return `
            <zone master="${master.macAddress}">
                ${members.map(child => {
                    return `<member ipaddress="${child.address}">${child.macAddress}</member>`
                })}
            </zone>
        `;
    }
}

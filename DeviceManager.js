const discover = require('./discovery');
const Device = require('./Device');
const api = require('./api');
const EventEmitter = require('events').EventEmitter;

class DeviceManager extends EventEmitter {

    constructor (devices = []) {
        super();

        this.devices = new Set();
        devices.forEach(this.add.bind(this));
    }

    add(device) {
        device.on('message', this._propagateUpdates.bind(this));
        this.devices.add(device);
    }

    toArray() {
        return Array.from(this.devices);
    }

    getPresets() {
        return api.presets(this.toArray()[0].address);
    }

    find(criteria) {
        const key = Object.keys(criteria)[0];
        const target = Array.from(this.devices).find(device => device[key] === criteria[key]);

        if (!target) {
            throw new Error('target not found');
        }

        return target;        
    }

    _propagateUpdates(data) {
        if (!data.updates) return;
        
        const device = this.find({ id: data.updates._attributes.deviceID });
        this.emit('message', {device, data});
    }

}

DeviceManager.discover = async function (timeout = 3000) {
    const devices = await discover();
    return Promise.all(devices.map(d => Device.create(d))).then(devices => new DeviceManager(devices));
}

module.exports = DeviceManager;
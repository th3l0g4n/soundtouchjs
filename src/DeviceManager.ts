import discover from './discovery';
import Device from './Device';
import * as api from './api';
import { EventEmitter } from 'events';

export default class DeviceManager extends EventEmitter {
    devices: Set<Device>;

    static async discover(timeout: number = 3000) {
        const devices: any[] = await discover(timeout);
        return Promise.all(devices.map(d => Device.create(d))).then(devices => new DeviceManager(devices));
    }

    constructor (devices: Device[] = []) {
        super();

        this.devices = new Set();
        devices.forEach(this.add.bind(this));
    }

    add(device: Device) {
        device.on('message', this._propagateUpdates.bind(this));
        this.devices.add(device);
    }

    toArray(): Device[] {
        return Array.from(this.devices);
    }

    getPresets() {
        return api.presets(this.toArray()[0].address);
    }

    find(criteria: any): Device | undefined {
        const key: string = Object.keys(criteria)[0];
        const target = Array.from(this.devices).find(device => {
            const deviceParams = device.toArray();
            return deviceParams[key] === criteria[key]
        });

        return target;        
    }

    _propagateUpdates(data: any) {
        if (!data.updates) return;
        
        const device = this.find({ id: data.updates._attributes.deviceID });
        this.emit('message', {device, data});
    }

}

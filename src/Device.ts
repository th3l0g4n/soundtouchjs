import * as api from './api';
import WebSocket from 'ws';
import { EventEmitter } from 'events';
import convert from 'xml-js';
import { IDevice } from './interfaces';

export default class Device extends EventEmitter {
    address: string;
    port: string;
    id: string;
    name: string;
    type: string;
    macAddress: string;

    ws: WebSocket;

    static async create(device: any) {
        const infoData = await api.info(device.address);
        return new Device({...infoData.info, ...device });
    }

    constructor (device: any) {
        super();

        this.address = device.address;
        this.port = device.port;
        this.id = device._attributes.deviceID;
        this.name = device.name._text;
        this.type = device.type._text;
        this.macAddress = device.networkInfo[0].macAddress._text;

        this.ws = new WebSocket(`ws://${this.address}:8080`, 'gabbo');
        this.ws.on('message', (data: any) => this.emit('message', JSON.parse(convert.xml2json(data, { compact: true }))));
    }

    toArray(): IDevice {
        return {
            address: this.address,
            port: this.port,
            id: this.id,
            name: this.name,
            type: this.type,
            macAddress: this.macAddress
        }
    }

    async pressKey(value: string): Promise<void> {
        await api.key(this.address, 'press', value)
        await api.key(this.address, 'release', value)
    }

    async togglePower(): Promise<void> {
        await this.pressKey('POWER');
    }

    async preset(preset: string): Promise<void> {
        await api.key(this.address, 'release', preset);
    }
}

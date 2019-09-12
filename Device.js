const api = require('./api');
const WebSocket = require('ws');
const EventEmitter = require('events').EventEmitter;
const convert = require('xml-js');

class Device extends EventEmitter {

    constructor (device) {
        super();

        this.address = device.address;
        this.port = device.port;
        this.id = device._attributes.deviceID;
        this.name = device.name._text;
        this.type = device.type._text;
        this.macAddress = device.networkInfo[0].macAddress._text;

        this.inZone = false;
        this.isMaster = false;
        this.ws = new WebSocket(`ws://${this.address}:8080`, 'gabbo');

        this.ws.on('message', data => this.emit('message', JSON.parse(convert.xml2json(data, { compact: true }))));
    }

    toArray() {
        return {
            address: this.address,
            port: this.port,
            id: this.id,
            name: this.name,
            type: this.type,
            macAddress: this.macAddress
        }
    }

    async pressKey(value) {
        await api.key(this.address, 'press', value)
        await api.key(this.address, 'release', value)
    }

    async togglePower() {
        await this.pressKey('POWER');
        return this;
    }

    async preset(preset) {
        await api.key(this.address, 'release', preset);
    }
}

Device.create = async function (device) {
    const infoData = await api.info(device.address);
    return new Device({...infoData.info, ...device });
}

module.exports = Device;
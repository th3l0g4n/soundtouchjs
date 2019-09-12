const { Client } = require('node-ssdp');
const Device = require('./Device');

const client = new Client();
const ssdpId = 'urn:schemas-upnp-org:device:MediaRenderer:1';

module.exports = (timeout = 3000) => {
    const devices = [];

    return new Promise((res, rej) => {
        client.on('response', (headers, code, info) => {
            devices.push(info);
        });

        setTimeout(() => res(devices), timeout);

        client.search(ssdpId);
    });
};
import { Client } from 'node-ssdp';

const client = new Client();
const ssdpId = 'urn:schemas-upnp-org:device:MediaRenderer:1';

export default (timeout: number = 3000): Promise<any> => {
    const devices: any[] = [];

    return new Promise((res, _rej) => {
        client.on('response', (_headers: any, _code: any, info: any) => {
            devices.push(info);
        });

        setTimeout(() => res(devices), timeout);

        client.search(ssdpId);
    });
};
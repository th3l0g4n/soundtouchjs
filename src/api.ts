import http from 'http';
import convert from 'xml-js';

function request(method: string, host: string, path: string, data?: string): Promise<any> {
    return new Promise((resolve, reject) => {
        const req = http.request({
            method,
            host,
            port: 8090,
            path,
            headers: {
                "Content-Type": "application/xml"
            }
        }, res => {
            let data = '';
    
            res.on('data', resData => data += resData);
            res.on('end', () => resolve(JSON.parse(convert.xml2json(data, { compact: true }))));
        });

        req.on('error', err => reject(err));
        data && req.write(data);
        
        req.end();
    });
}

export function info(ip: string) {
    return request('GET', ip, '/info');
}

export function nowPlaying(ip: string) {
    return request('GET', ip, '/now_playing');
}

export function volume(ip: string) {
    return request('GET', ip, '/volume');
}

export function presets(ip: string) {
    return request('GET', ip, '/presets');
}

export function getGroup(ip: string) {
    return request('GET', ip, '/getGroup');
}

export function getZone(ip: string) {
    return request('GET', ip, '/getZone');
}

export function key(ip: string, state: string, value: string) {
    return request('POST', ip, '/key', `<key state="${state}" sender="Gabbo">${value}</key>`);
}

export function setZone(ip: string, payload: string) {
    return request('POST', ip, '/setZone', payload);
}

export function addZoneSlave(ip: string, payload: string) {
    return request('POST', ip, '/addZoneSlave', payload);
}

export function removeZoneSlave(ip: string, payload: string) {
    return request('POST', ip, '/removeZoneSlave', payload);
}

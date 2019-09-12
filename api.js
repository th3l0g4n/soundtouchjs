const http = require('http');
const convert = require('xml-js');

function request(method, host, path, data) {
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

function info(ip) {
    return request('GET', ip, '/info');
}

function nowPlaying(ip) {
    return request('GET', ip, '/now_playing');
}

function volume(ip) {
    return request('GET', ip, '/volume');
}

function presets(ip) {
    return request('GET', ip, '/presets');
}

function getGroup(ip) {
    return request('GET', ip, '/getGroup');
}

function getZone(ip) {
    return request('GET', ip, '/getZone');
}

function key(ip, state, value) {
    return request('POST', ip, '/key', `<key state="${state}" sender="Gabbo">${value}</key>`);
}

function setZone(ip, payload) {
    return request('POST', ip, '/setZone', payload);
}

function addZoneSlave(ip, payload) {
    return request('POST', ip, '/addZoneSlave', payload);
}

function removeZoneSlave(ip, payload) {
    return request('POST', ip, '/removeZoneSlave', payload);
}



module.exports = {
    info,
    nowPlaying,
    volume,
    presets,
    getGroup,
    getZone,
    setZone,
    addZoneSlave,
    removeZoneSlave,
    key
}
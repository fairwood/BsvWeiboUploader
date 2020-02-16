/*
    A little slower than MatterCloud but supports much more APIs than MatterCloud. Using WhatsOnChain.com
*/

var https = require('https');

const HOSTNAME = 'api.whatsonchain.com'
const API_PREFIX = "https://api.whatsonchain.com/v1/bsv/main"

exports.getTx = function (txhash, callback, errorCallback) {
    let path = `${API_PREFIX}/tx/hash/${txhash}`
    let data = ''
    const req = https.get(path, (res) => {
        res.setEncoding('utf8');
        res.on('data', (chunk) => {
            data += chunk
        });
        res.on('end', () => {
            callback(data)
        });
    });

    req.on('error', (e) => {
        console.error(`请求遇到问题: ${e.message}`);
        if (errorCallback) { errorCallback(e) }
    });
}

exports.getTxAsync = function (txhash) {
    return new Promise(function (resolve, reject) {
        let path = `${API_PREFIX}/tx/hash/${txhash}`
        let data = ''
        const req = https.get(path, (res) => {
            res.setEncoding('utf8');
            res.on('data', (chunk) => {
                data += chunk
            });
            res.on('end', () => {
                resolve(data)
            });
        });

        req.on('error', (e) => reject(e));
    })
}

exports.getUTXOs = function (address, callback, errorCallback) {
    let path = `${API_PREFIX}/address/${address}/unspent`
    let data
    const req = https.get(path, (res) => {
        res.setEncoding('utf8');
        res.on('data', (chunk) => {
            data = chunk
        });
        res.on('end', () => {
            callback(data)
        });
    });

    req.on('error', (e) => {
        console.error(`请求遇到问题: ${e.message}`);
        if (errorCallback) { errorCallback(e) }
    });
}


exports.broadcastTx = function (rawTxInHex, callback, errorCallback) {
    
    var postData = JSON.stringify({
        "txhex": rawTxInHex
    });

    const options = {
        hostname: HOSTNAME,
        port: 443,
        path: '/v1/bsv/main/tx/raw',
        method: 'POST',
        rejectUnauthorized: true,
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData)
        }
    }

    const req = https.request(options, (res) => {
        let data
        res.setEncoding('utf8');
        res.on('data', (chunk) => {
            data = chunk
        });
        res.on('end', () => {
            callback(data)
        });
    });

    req.on('error', (e) => {
        console.error(`请求遇到问题: ${e.message}`);
        if (errorCallback) { errorCallback(e) }
    });

    // 将数据写入请求主体。
    
    req.write(postData);
    req.end();
}
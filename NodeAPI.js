var http = require('https');

const HOSTNAME = 'api.whatsonchain.com'
const API_PREFIX = "https://api.whatsonchain.com/v1/bsv/main"

// var txhash = "2ae08e256155d1ecc99bfcfeb9a1cb06f3fa2577ed8499b6cb3a1eba7dcae05d"

// const options = {
//     hostname: 'api.whatsonchain.com',
//     port: 80,
//     path: '/v1/bsv/main/tx/hash/2ae08e256155d1ecc99bfcfeb9a1cb06f3fa2577ed8499b6cb3a1eba7dcae05d',
//     method: 'GET',
//     headers: {
//         'Content-Type': 'application/x-www-form-urlencoded',
//         'Content-Length': 0
//     }
// }

// const req = http.get(api + '/' + txhash, (res) => {
//     console.log(`状态码: ${res.statusCode}`);
//     console.log(`响应头: ${JSON.stringify(res.headers)}`);
//     res.setEncoding('utf8');
//     res.on('data', (chunk) => {
//         console.log(`响应主体: ${chunk}`);
//     });
//     res.on('end', () => {
//         console.log('响应中已无数据');
//     });
// });

// req.on('error', (e) => {
//     console.error(`请求遇到问题: ${e.message}`);
// });

exports.getTx = function (txhash, callback, errorCallback) {
    let path = `${API_PREFIX}/tx/hash/${txhash}`
    let data
    const req = http.get(path, (res) => {
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

exports.getUTXOs = function (address, callback, errorCallback) {
    let path = `${API_PREFIX}/address/${address}/unspent`
    let data
    const req = http.get(path, (res) => {
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
    var postData = JSON.stringify({
        "txhex": rawTxInHex
    });
    req.write(postData);
    req.end();
}
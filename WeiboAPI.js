var https = require('https');

// exports.oauth2 = {}
// exports.oauth2.authorize = function()

const URL0 = "https://weibo.com/7188541529/IurC1lP7f?type=comment#_rnd1581825096051"
const URL1 = "https://passport.weibo.com/visitor/visitor?entry=miniblog&a=enter&url=https%3A%2F%2Fweibo.com%2F7188541529%2FIurC1lP7f&domain=.weibo.com&ua=php-sso_sdk_client-0.6.28&_rand=1581827794.6423"

exports.statuses = {}
exports.statuses.show = function (id, callback, errorCallback) {
    let path = URL1
    let data = ''
    let i = 0
    console.log('show wb', path);
    
    const req = https.get(path, (res) => {
        console.log('sC', res.statusCode, res.statusMessage)
        console.log('headers', res.headers.location)
        
        res.setEncoding('utf8');
        res.on('data', (chunk) => {
            console.log('ondata', chunk);
            
            data += chunk
        });
        res.on('end', () => {
            console.log('onend', data);
            callback(data)
        });
    });

    req.on('error', (e) => {
        console.error(`请求遇到问题: ${e.message}`);
        if (errorCallback) { errorCallback(e) }
    });
}
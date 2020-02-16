var https = require('https');

// exports.oauth2 = {}
// exports.oauth2.authorize = function()

const URL_PREFIX = "https://m.weibo.cn/statuses"
const URL0 = "https://weibo.com/7188541529/IurC1lP7f?type=comment#_rnd1581825096051"
//const URL1 = "https://passport.weibo.com/visitor/visitor?entry=miniblog&a=enter&url=https%3A%2F%2Fweibo.com%2F7188541529%2FIurC1lP7f&domain=.weibo.com&ua=php-sso_sdk_client-0.6.28&_rand=1581827794.6423"
//const URL2 = "https://api.weibo.com/oauth2/authorize"

exports.statuses = {}
exports.statuses.show = function (rawUrl, callback, errorCallback) {
    //https://m.weibo.cn/statuses/show?id=IusJTusYl
    let index_w = rawUrl.search('weibo')
    if (index_w < 0) {
        console.log('ERROR: Not a weibo URL.', rawUrl)
        return null
    } else {
        let indexOfWbid = rawUrl.lastIndexOf('/') + 1
        let indexOfQuestionMark = rawUrl.indexOf('?', indexOfWbid)
        let wbid = rawUrl.substring(indexOfWbid, indexOfQuestionMark)
        console.log(wbid);
        let path = URL_PREFIX + '/show?id=' + wbid
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
}

exports.statuses.showAsync = function (rawUrl) {
    return new Promise(function (resolve, reject) {
        let index_w = rawUrl.search('weibo')
        if (index_w < 0) {
            console.log('ERROR: Not a weibo URL.', rawUrl)
            return null
        } else {
            let indexOfWbid = rawUrl.lastIndexOf('/') + 1
            let indexOfQuestionMark = rawUrl.indexOf('?', indexOfWbid)
            let wbid = rawUrl.substring(indexOfWbid, indexOfQuestionMark)
            let path = URL_PREFIX + '/show?id=' + wbid
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

            req.on('error', (e) => {
                req.on('error', (e) => reject(e));
            });
        }
    })
}

//组装md
exports.BuildMarkdownFromWeiboData = function (weiboData) {
    let user = weiboData.user

    let profileImageUrl = function (url) {
        let indexQ = url.indexOf('?')
        return url.substring(0, indexQ)
    }(user.profile_image_url)

    let md = `[<img src="${profileImageUrl}" width=50 >](${user.profile_url}) `
        + `[**${user.screen_name}**](${user.profile_url})\n\n`

        + `<sub>[${weiboData.created_at}](https://weibo.com/${user.id}/${weiboData.bid}) 来自 ${weiboData.source}</sub>\n\n`

        + '***\n\n'

        + weiboData.text + '\n\n';

    if (weiboData.pics) {
        weiboData.pics.forEach(picData => {
            if (picData.large) {
                md += `![](${picData.large.url})`
            } else {
                md += `![](${picData.url})`
            }
        });

        md += '\n\n'
    }

    md += `<sub>使用 [微博存证](https://github.com/fairwood/BsvWeiboUploader) 自动上链</sub>`

    return md
}
var https = require('https');

const URL_PREFIX = "https://m.weibo.cn/statuses"

exports.statuses = {}
exports.statuses.show = function (rawUrl, callback, errorCallback) {
    // rawUrl 形如 https://weibo.com/2279895404/Iv37kpfoz?…… 
    // 或 https://m.weibo.cn/status/4473699338190456?……
    // 或 https://m.weibo.cn/1618819632/4473699338190456?……
    // API 形如 https://m.weibo.cn/statuses/show?id=IusJTusYl
    let index_w = rawUrl.search('weibo')
    if (index_w < 0) {
        console.log('ERROR: Not a weibo URL.', rawUrl)
        return null
    } else {
        let indexOfWbid = rawUrl.lastIndexOf('/') + 1
        let indexOfQuestionMark = rawUrl.indexOf('?', indexOfWbid)
        if (indexOfQuestionMark < 0) indexOfQuestionMark = rawUrl.length
        let wbid = rawUrl.substring(indexOfWbid, indexOfQuestionMark)
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
            reject('ERROR: Not a weibo URL. ' + rawUrl)
        } else {
            let indexOfWbid = rawUrl.lastIndexOf('/') + 1
            let indexOfQuestionMark = rawUrl.indexOf('?', indexOfWbid)
            if (indexOfQuestionMark < 0) indexOfQuestionMark = rawUrl.length
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

let _buildMarkdownFromStatusWithoutRetweet = function (status, picMode, dictPicUrlToTxid) {
    let user = status.user

    let md = ''

    if (user) {
        let profileImageUrl = function (url) {
            let indexQ = url.indexOf('?')
            return url.substring(0, indexQ)
        }(user.profile_image_url)

        md = `<a href="${user.profile_url}"><img src="${profileImageUrl}" width=50 > <b>${user.screen_name}</b></a>\n\n`
    }

    let userid = user ? user.id : null

    let date = new Date(status.created_at)
    let timestr = date.toLocaleString('ch-CN', { hour12: false, timeZoneName: 'short' })
    let text = status.longText ? status.longText.longTextContent : status.text

    md += `<sub>[${timestr}](https://weibo.com/${userid}/${status.bid}) 来自 ${status.source}</sub>\n\n`

        + '***\n\n'

        + text;

    if (status.pics) {

        md += '\n\n'

        status.pics.forEach(picData => {
            if (picMode == 0) {
                if (picData.large) {
                    md += `<img src="${picData.large.url}"> `
                } else {
                    md += `<img src="${picData.url}"> `
                }
            } else {
                let picTxid
                if (picData.large && picMode == 2) {
                    picTxid = dictPicUrlToTxid[picData.large.url]
                } else {
                    picTxid = dictPicUrlToTxid[picData.url]
                }
                md += `[![${picTxid}](b://${picTxid})](https://whatsonchain.com/tx/${picTxid}) `
            }
        });
    }

    return md
}

//组装md
exports.BuildMarkdownFromWeiboData = function (status, picMode, dictPicUrlToTxid) {

    let mdData = {}

    mdData.filename = `微博存档|@${status.user.screen_name}|${status.status_title}`

    let body = _buildMarkdownFromStatusWithoutRetweet(status, picMode, dictPicUrlToTxid)

    if (status.retweeted_status) {

        body += '\n\n'

        //包含转发的微博
        let retweetMd = '><br>' + _buildMarkdownFromStatusWithoutRetweet(status.retweeted_status, picMode, dictPicUrlToTxid) + '<br><br>'
        retweetMd = retweetMd.replace(/\n/g, '\n>')
        body += retweetMd
    }

    body += '\n\n'

    body += `<sub><sub>使用 [微博存证助手](https://github.com/fairwood/BsvWeiboUploader) 一键上链</sub></sub>`

    mdData.body = body

    return mdData
}

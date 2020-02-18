var fs = require('fs')
var WeiboAPI = require('./WeiboAPI')
var bsv = require('bsv')
var MatterCloud = require('mattercloudjs')
var secret = require('./secret')
var ArchiveBProtocol = require('./ArchiveBProtocol')
var DownloadImage = require('./DownloadImage')

var matterOptions = {
    api_key: "2aLxRDjQFELKEu23ExkGTkzra4E2R4p6p4AAb8EMgA4WY1kQjTWbwmAqE1jdwpJ8GX",
}
var matter = MatterCloud.instance(matterOptions)

const feeRate = 0.5 // sat/byte
const BProtocolPrefix = "19HxigV4QyBv3tHpQVcUEQyq1pzZVdoAut"
const MyPrivateKey = bsv.PrivateKey.fromString(secret.PrivateKey)
const MyAddress = MyPrivateKey.toAddress()

const URL = "https://weibo.com/2279895404/IuOAhxKzU?ref=home" //我的测试微博
//const URL = "https://weibo.com/1639483893/IuOFeBSaG?ref=home&rid=8_0_8_4727976166387420264_0_0_0"
const PIC_MODE = 1 //0-reference only  1-small image  2-large image

let uploadMdBodyBuffer
let uploadMdFilename //without extension

WeiboAPI.statuses.showAsync(URL).then(async function (res) {

    let json = JSON.parse(res)
    let jsonStatus = json.data

    fs.writeFile('./temp_weibo.json', JSON.stringify(json), () => { })

    let dictPicUrlToTxid

    if (jsonStatus.pics && PIC_MODE != 0) {
        dictPicUrlToTxid = {}
        for (let i = 0; i < jsonStatus.pics.length; i++) {
            const picData = jsonStatus.pics[i];
            let picUrl
            if (picData.large && PIC_MODE == 2) {
                picUrl = picData.large.url
            } else {
                picUrl = picData.url
            }
            console.log('==41', picUrl);
            let buffer = await DownloadImage.downloadImageToBuffer(picUrl)
            let mediaType = DownloadImage.getImageMediaType(buffer)
            let fileHashInHex = bsv.crypto.Hash.sha256(buffer).toString('hex')
            console.log('==52 buffer len', buffer.length, mediaType, fileHashInHex)
            let picTxid = await ArchiveBProtocol.archiveBProtocol(buffer, mediaType, 'binary', fileHashInHex, feeRate, MyPrivateKey)
            dictPicUrlToTxid[picUrl] = picTxid

            console.log('--56', picTxid);
        }
    }

    let mdData = WeiboAPI.BuildMarkdownFromWeiboData(jsonStatus, PIC_MODE, dictPicUrlToTxid)

    fs.writeFile('./temp_markdown.md', mdData.filename + '.md\n---\n\n' + mdData.body, () => { })

    uploadMdFilename = mdData.filename

    uploadMdBodyBuffer = new Buffer(mdData.body)

}).then(function () {

    console.log('$$67');
    ArchiveBProtocol.archiveBProtocol(uploadMdBodyBuffer, 'text/markdown', 'UTF-8', uploadMdFilename, feeRate, MyPrivateKey)

}).catch(console.log)
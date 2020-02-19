var fs = require('fs')
var WeiboAPI = require('./WeiboAPI')
var bsv = require('bsv')
var SimpleWallet = require('./SimpleWallet')
var DownloadImage = require('./DownloadImage')


const FEE_RATE = 0.5 // sat/byte

const PIC_MODE = 1 // 0-reference only  1-small image  2-large image

//↓↓↓↓↓↓↓↓↓↓↓
const URL = "https://weibo.com/2279895404/IuOAhxKzU" //修改这个URL为你要存档的微博URL
//↑↑↑↑↑↑↑↑↑↑↑

const path = './secret.json'

var secret

if (fs.existsSync(path)) {
    secret = JSON.parse(fs.readFileSync(path).toString())
} else {
    console.log('没找到 secret.json 文件，请先运行 node newWallet.js 创建钱包，并确保里面有钱！');
    return
}

let simpleWallet = new SimpleWallet(secret.PrivateKey, FEE_RATE)
let balanceBefore

let uploadMdBodyBuffer
let uploadMdFilename //without extension

simpleWallet.fetchUTXOs().then(async function () {
    balanceBefore = simpleWallet.getBalance()
    console.log(`钱包初始化成功，地址 ${simpleWallet.address.toString()}   余额 ${balanceBefore} sat`)
    if (balanceBefore <= 0) {
        throw new Error('钱包里没有余额，请先充值。运行 node deposit.js 查看地址和二维码')
    }
    return await WeiboAPI.statuses.showAsync(URL)
}).then(async function (res) {

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
            let buffer = await DownloadImage.downloadImageToBuffer(picUrl)
            let mediaType = DownloadImage.getImageMediaType(buffer)
            let fileHashInHex = bsv.crypto.Hash.sha256(buffer).toString('hex')
            let picTxid = await simpleWallet.archiveBProtocol(buffer, mediaType, 'binary', fileHashInHex)
            dictPicUrlToTxid[picUrl] = picTxid
        }
    }

    let mdData = WeiboAPI.BuildMarkdownFromWeiboData(jsonStatus, PIC_MODE, dictPicUrlToTxid)

    fs.writeFile('./temp_markdown.md', mdData.filename + '.md\n---\n\n' + mdData.body, () => { })

    uploadMdFilename = mdData.filename

    uploadMdBodyBuffer = Buffer.from(mdData.body)

}).then(async function () {

    await simpleWallet.archiveBProtocol(uploadMdBodyBuffer, 'text/markdown', 'UTF-8', uploadMdFilename)

    let balanceNow = simpleWallet.getBalance()
    
    console.log(`完成，地址${simpleWallet.address.toString()}   花费 ${balanceBefore - balanceNow} sat   余额 ${balanceNow} sat`)

}).catch(console.log)
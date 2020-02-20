var fs = require('fs')
var WeiboAPI = require('./WeiboAPI')
var bsv = require('bsv')
var SimpleWallet = require('./SimpleWallet')
var DownloadImage = require('./DownloadImage')
var CLIReadSync = require('./CLIReadSync')

const FEE_RATE = 0.5 // sat/byte

//↓↓↓↓↓↓↓↓↓↓↓
//const URL = "https://weibo.com/2279895404/IkN1GC9Q4" //修改这个URL为你要存档的微博URL
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

function getCtrlKeyName() {
    switch (process.platform) {
        case "darwin":
            return 'CMD'
        case "win32":
            return 'Ctrl'
        default:
            return 'Ctrl'
    }
}

async function loop() {

    while (true) {

        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

        let inputStr = await CLIReadSync.readSyncByRl(`输入微博 URL：（按${getCtrlKeyName()}+C退出）\n`)

        let args = inputStr.split(' ')

        let URL = args[0]

        if (!URL) {
            console.log('ERROR: 没有输入正确的微博URL')
            continue
        }

        let picMode = args[1] ? Number.parseInt(args[1]) : 1

        let overrideFeeRate = args[2] && Number.parseFloat(args[2])

        try {

            await simpleWallet.fetchUTXOs()

            balanceBefore = simpleWallet.getBalance()
            console.log(`钱包初始化成功，地址 ${simpleWallet.address.toString()}   余额 ${balanceBefore} sat`)
            if (balanceBefore <= 0) {
                throw new Error('钱包里没有余额，请先充值。运行 node deposit.js 查看地址和二维码')
            }
            res = await WeiboAPI.statuses.showAsync(URL)

            fs.writeFile('./temp_weibo.json', res, () => { })

            let json = JSON.parse(res)
            let jsonStatus = json.data

            let dictPicUrlToTxid

            if (jsonStatus.pics && picMode != 0) {
                dictPicUrlToTxid = {}
                for (let i = 0; i < jsonStatus.pics.length; i++) {
                    const picData = jsonStatus.pics[i];
                    let picUrl
                    if (picData.large && picMode == 2) {
                        picUrl = picData.large.url
                    } else {
                        picUrl = picData.url
                    }
                    let buffer = await DownloadImage.downloadImageToBuffer(picUrl)
                    let mediaType = DownloadImage.getImageMediaType(buffer)
                    let fileHashInHex = bsv.crypto.Hash.sha256(buffer).toString('hex')
                    let picTxid = await simpleWallet.archiveBProtocol(buffer, mediaType, 'binary', fileHashInHex, overrideFeeRate)
                    dictPicUrlToTxid[picUrl] = picTxid
                }
            }

            let mdData = WeiboAPI.BuildMarkdownFromWeiboData(jsonStatus, picMode, dictPicUrlToTxid)

            fs.writeFile('./temp_markdown.md', mdData.filename + '.md\n---\n\n' + mdData.body, () => { })

            uploadMdFilename = mdData.filename

            uploadMdBodyBuffer = Buffer.from(mdData.body)

            await simpleWallet.archiveBProtocol(uploadMdBodyBuffer, 'text/markdown', 'UTF-8', uploadMdFilename, overrideFeeRate)

            let balanceNow = simpleWallet.getBalance()

            console.log(`完成，地址${simpleWallet.address.toString()}   花费 ${balanceBefore - balanceNow} sat   余额 ${balanceNow} sat`)

        } catch (error) {
            console.log('ERROR:', error);
        }
    }
}

loop().catch(console.log)
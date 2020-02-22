var fs = require('fs')
var WeiboAPI = require('./WeiboAPI')
var bsv = require('bsv')
var SimpleWallet = require('./SimpleWallet')
var DownloadImage = require('./DownloadImage')
var ArchiveRecord = require('./ArchiveRecord')

/**
 * @returns true-再次询问输入url;  false-返回上级菜单
 */
module.exports = async function archiveWeibo(URL, picMode, overrideFeeRate) {

    const FEE_RATE = 0.5 // sat/byte

    const path = './secret.json'
    var secret
    if (fs.existsSync(path)) {
        secret = JSON.parse(fs.readFileSync(path).toString())
    } else {
        console.log('没有钱包，请先创建钱包或导入私钥，并确保里面有几千 sat 以上的钱！');
        return false
    }
    let simpleWallet = new SimpleWallet(secret.PrivateKey, secret.FeeRate || 0.5)

    let balanceBefore

    let uploadMdBodyBuffer
    let uploadMdFilename //without extension

    let archiveRecords = []

    try {
        ArchiveRecord.checkAndCreateCSV()
    } catch (error) {
        console.log('ERROR:', error);
    }

    if (!URL) {
        console.log('ERROR: 没有输入正确的微博链接')
        return true
    }

    try {

        await simpleWallet.fetchUTXOs()

        balanceBefore = simpleWallet.getBalance()
        console.log(`钱包初始化成功，地址 ${simpleWallet.address.toString()}   余额 ${balanceBefore} sat`)
        if (balanceBefore <= 0) {
            console.log('钱包里没有余额，请先充值')
            return false
        }
        res = await WeiboAPI.statuses.showAsync(URL)

        fs.writeFile('./temp_weibo.json', res, () => { })

        let json = JSON.parse(res)
        let jsonStatus = json.data
        let statusTitle = jsonStatus.status_title

        let dictPicUrlToTxid

        if (picMode != 0) {
            dictPicUrlToTxid = {}
            async function processPics(picDatas) {
                for (let i = 0; i < picDatas.length; i++) {
                    const picData = picDatas[i];
                    let picUrl
                    if (picData.large && picMode == 2) {
                        picUrl = picData.large.url
                    } else {
                        picUrl = picData.url
                    }
                    let buffer = await DownloadImage.downloadImageToBuffer(picUrl)
                    let mediaType = DownloadImage.getImageMediaType(buffer)
                    let fileHashInHex = bsv.crypto.Hash.sha256(buffer).toString('hex')
                    let picRes = await simpleWallet.archiveBProtocol(buffer, mediaType, 'binary', fileHashInHex, overrideFeeRate)
                    let picTxid = picRes.txid
                    if (picRes.ok) {
                        archiveRecords.push(new ArchiveRecord.ArchiveRecord(picTxid, 'Image', picRes.fee, `http://bico.media/${picTxid}`, picUrl, statusTitle))
                    }
                    console.log('─────────────────────────────────────────────────────────────────');
                    dictPicUrlToTxid[picUrl] = picTxid
                }
            }
            if (jsonStatus.pics) {
                await processPics(jsonStatus.pics)
            }
            if (jsonStatus.retweeted_status && jsonStatus.retweeted_status.pics) {
                await processPics(jsonStatus.retweeted_status.pics)
            }

        }

        let mdData = WeiboAPI.BuildMarkdownFromWeiboData(jsonStatus, picMode, dictPicUrlToTxid)
        fs.writeFile('./temp_markdown.md', mdData.filename + '.md\n---\n\n' + mdData.body, () => { })

        uploadMdFilename = mdData.filename
        uploadMdBodyBuffer = Buffer.from(mdData.body)

        let mdRes = await simpleWallet.archiveBProtocol(uploadMdBodyBuffer, 'text/markdown', 'UTF-8', uploadMdFilename, overrideFeeRate)
        let mdTxid = mdRes.txid
        if (mdRes.ok) {
            archiveRecords.push(new ArchiveRecord.ArchiveRecord(mdTxid, 'Weibo', mdRes.fee, `http://bico.media/${mdTxid}`, URL, statusTitle))
        }
        
        let balanceNow = simpleWallet.getBalance()

        console.log(`完成，地址${simpleWallet.address.toString()}   花费 ${balanceBefore - balanceNow} sat   余额 ${balanceNow} sat  已录入record.csv`)
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

        ArchiveRecord.saveRecordsToCSV(archiveRecords)

    } catch (error) {
        console.log('ERROR:', error);
    }

    return true
}
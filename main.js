var WeiboAPI = require('./WeiboAPI')
var bsv = require('bsv')
var MatterCloud = require('mattercloudjs')
var secret = require('./secret')

var matterOptions = {
    api_key: "2aLxRDjQFELKEu23ExkGTkzra4E2R4p6p4AAb8EMgA4WY1kQjTWbwmAqE1jdwpJ8GX",
}
var matter = MatterCloud.instance(matterOptions)

const feeRate = 0.5 // sat/byte
const BProtocolPrefix = "19HxigV4QyBv3tHpQVcUEQyq1pzZVdoAut"
const MyPrivateKey = bsv.PrivateKey.fromString(secret.PrivateKey)
const MyAddress = MyPrivateKey.toAddress()

const URL = "https://weibo.com/1658988854/Iur4rilwI"

let bufferMd

WeiboAPI.statuses.showAsync(URL).then(function (res) {

    let json = JSON.parse(res)
    let md = WeiboAPI.BuildMarkdownFromWeiboData(json.data)

    bufferMd = new Buffer(md)

}).then(function () {

    return matter.getUtxos(MyAddress.toString())

}).then(function (jsonUtxos) {

    var newTx = new bsv.Transaction()
    newTx.feePerKb(feeRate * 1000)
    inputs = []
    let totalInputValue = 0
    jsonUtxos.forEach(jsonUtxo => {
        let utxo = new bsv.Transaction.UnspentOutput(jsonUtxo)
        inputs.push(utxo)
        totalInputValue += jsonUtxo.value
    });
    console.log(`地址${MyAddress}  余额${totalInputValue}sat`)
    newTx.from(inputs)
    var opreturnOutputScript = bsv.Script.fromASM(`OP_FALSE OP_RETURN ${Buffer.from(BProtocolPrefix).toString('hex')}`)
    opreturnOutputScript.add(bufferMd)
    opreturnOutputScript.add(Buffer.from('text/markdown')) //image/png'))
    opreturnOutputScript.add(Buffer.from('UTF-8'))
    opreturnOutputScript.add(Buffer.from('测试微博上链by脚本.md'))

    var jsonOpreturnOutput = {
        satoshis: 0,
        script: opreturnOutputScript
    }
    var opreturnOutput = new bsv.Transaction.Output(jsonOpreturnOutput)
    newTx.addOutput(opreturnOutput)

    newTx.change(MyAddress)

    signedTx = newTx.sign(MyPrivateKey)

    console.log('已签名事务:')
    console.log(signedTx.toBuffer().toString('hex'))
    console.log()

    return signedTx

}).then(function (signedTx) {

    matter.sendRawTx(signedTx.toBuffer().toString('hex'), (res) => {
        let txid = res.txid
        console.log('发送成功 txid:', txid)
        console.log(`事务信息 https://whatsonchain.com/tx/${txid}`)
        console.log(`在Bico查看 https://bico.media/${txid}`)
    })
    
}).catch(console.log)
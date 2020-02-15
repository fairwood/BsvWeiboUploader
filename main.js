var fs = require('fs')
var bsv = require('bsv')
var BN = require('bn.js')
var MatterCloud = require('mattercloudjs')
var NodeAPI = require('./NodeAPI')
var secret = require('./secret')

var matterOptions = {
    api_key: "2aLxRDjQFELKEu23ExkGTkzra4E2R4p6p4AAb8EMgA4WY1kQjTWbwmAqE1jdwpJ8GX",
}
var matter = MatterCloud.instance(matterOptions)

const feeRate = 0.5 // sat/byte
const BProtocolPrefix = "19HxigV4QyBv3tHpQVcUEQyq1pzZVdoAut"

var bufferTestpic = fs.readFileSync('./testT.png')

matter.getUtxos(secret.Address).then(function (jsonUtxos) {
    var newTx = new bsv.Transaction()
    newTx.feePerKb(feeRate * 1000)
    inputs = []
    totalInputValue = 0
    jsonUtxos.forEach(jsonUtxo => {
        let utxo = new bsv.Transaction.UnspentOutput(jsonUtxo)
        inputs.push(utxo)
        totalInputValue += jsonUtxo.value
    });
    newTx.from(inputs)
    var len = bufferTestpic.length
    console.log('16radix', len.toString('16'))
    var opreturnOutputScript = bsv.Script.fromASM(`OP_FALSE OP_RETURN ${Buffer.from(BProtocolPrefix).toString('hex')}`)
    opreturnOutputScript.add(bufferTestpic)
    opreturnOutputScript.add(Buffer.from('image/png'))
    opreturnOutputScript.add(Buffer.from('binary'))
    opreturnOutputScript.add(Buffer.from('testT-by-hand.png'))
    
    var jsonOpreturnOutput = {
        satoshis: 0,
        script: opreturnOutputScript
    }
    var opreturnOutput = new bsv.Transaction.Output(jsonOpreturnOutput)
    newTx.addOutput(opreturnOutput)

    newTx.change(new bsv.Address(secret.Address))

    signedTx = newTx.sign(new bsv.PrivateKey(secret.PrivateKey))

    console.log(signedTx.toBuffer().toString('hex'))

    NodeAPI.broadcastTx(signedTx.toBuffer().toString('hex'), (res) => { console.log(res) })
}).catch(console.log)
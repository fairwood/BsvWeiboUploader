var bsv = require('bsv')
var BN = require('bn.js')
var MatterCloud = require('mattercloudjs')
var NodeAPI = require('./NodeAPI')
var secret = require('./secret')

var matterOptions = {
    api_key: "2aLxRDjQFELKEu23ExkGTkzra4E2R4p6p4AAb8EMgA4WY1kQjTWbwmAqE1jdwpJ8GX",
}
var matter = MatterCloud.instance(matterOptions)

const feeRate = 0.25 // sat/byte

// NodeAPI.getUTXOs(secret.Address, (ch) => { console.log('WOC:', ch) })


//NodeAPI.getTx('5e3014372338f079f005eedc85359e4d96b8440e7dbeb8c35c4182e0c19a1a12', (ch) => { console.log(ch) })

// var address = bsv.Address.fromString(secret.Address)

// var script = bsv.Script.fromAddress(address)

// console.log(script.toASM())
// 'OP_DUP OP_HASH160 e2a623699e81b291c0327f408fea765d534baa2a OP_EQUALVERIFY OP_CHECKSIG'

var txs = {}

function getPrevTxs(utxos) {
    return new Promise(function (resolve, reject) {
        let counter = 0
        for (let i = 0; i < utxos.length; i++) {
            const utxo = utxos[i];
            if (!txs[utxo.txid]) {
                txs[utxo.txid] = true
                NodeAPI.getTxAsync(utxo.txid).then(function (txData) {
                    txs[utxo.txid] = txData
                    counter += 1
                    if (counter >= utxos.length) {
                        resolve(utxos)
                    }
                }).catch((e) => console.log('error', e))
            }
        }
    })
}

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

    newTx.change(new bsv.Address(secret.Address))

    signedTx = newTx.sign(new bsv.PrivateKey(secret.PrivateKey))

    console.log(signedTx.toBuffer().toString('hex'), signedTx.toBuffer().length)

    NodeAPI.broadcastTx(signedTx.toBuffer().toString('hex'), (res) => { console.log(res) })
}).catch(console.log)
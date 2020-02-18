const bsv = require('bsv')
var MatterCloud = require('mattercloudjs')
var matterOptions = {
    api_key: "2aLxRDjQFELKEu23ExkGTkzra4E2R4p6p4AAb8EMgA4WY1kQjTWbwmAqE1jdwpJ8GX",
}
var matter = MatterCloud.instance(matterOptions)
const BProtocolPrefix = "19HxigV4QyBv3tHpQVcUEQyq1pzZVdoAut"

/*
dataBuffer: BinaryData in Buffer
mediaType: 'image/png'
encoding: 'UTF-8'
*/
exports.archiveBProtocol = async function (dataBuffer, mediaType, encoding, filename, feeRate, privateKey) {
    let address = privateKey.toAddress()
    let jsonUtxos = await matter.getUtxos(address.toString())
    var newTx = new bsv.Transaction()
    newTx.feePerKb(feeRate * 1000)
    inputs = []
    let totalInputValue = 0
    jsonUtxos.forEach(jsonUtxo => {
        let utxo = new bsv.Transaction.UnspentOutput(jsonUtxo)
        inputs.push(utxo)
        totalInputValue += jsonUtxo.value
    });
    console.log(`地址${address}  余额${totalInputValue}sat`)
    newTx.from(inputs)
    var opreturnOutputScript = bsv.Script.fromASM(`OP_FALSE OP_RETURN ${Buffer.from(BProtocolPrefix).toString('hex')}`)
    opreturnOutputScript.add(dataBuffer)
    opreturnOutputScript.add(Buffer.from(mediaType))
    opreturnOutputScript.add(Buffer.from(encoding))
    opreturnOutputScript.add(Buffer.from(filename))

    var jsonOpreturnOutput = {
        satoshis: 0,
        script: opreturnOutputScript
    }
    var opreturnOutput = new bsv.Transaction.Output(jsonOpreturnOutput)
    newTx.addOutput(opreturnOutput)

    newTx.change(address)

    signedTx = newTx.sign(privateKey)

    console.log(mediaType, filename, 'signed tx:')
    console.log(signedTx.toBuffer().toString('hex'))
    console.log()
    let txid = null

    try {
        let res = await matter.sendRawTx(signedTx.toBuffer().toString('hex'))
        txid = res.txid
        console.log('Archive successful. txid:', txid)
        console.log(`Check tx https://whatsonchain.com/tx/${txid}`)
        console.log(`Check file on Bico https://bico.media/${txid}`)
    } catch (error) {
        console.log('_54ERROR:', error);
    }

    // await matter.sendRawTx(signedTx.toBuffer().toString('hex'), (res, err) => {
    //     if (res) {
    //         txid = res.txid
    //         console.log('Archive successful. txid:', txid)
    //         console.log(`Check tx https://whatsonchain.com/tx/${txid}`)
    //         console.log(`Check file on Bico https://bico.media/${txid}`)
    //     } else {
    //         console.log('sendRawTx ERROR:', err);
    //     }
    // }).catch(e => { console.log('ERRER:', e); })

    console.log('=+=63', txid)
    return txid
}
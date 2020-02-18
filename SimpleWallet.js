const bsv = require('bsv')
var MatterCloud = require('mattercloudjs')
var matterOptions = {
    api_key: "2aLxRDjQFELKEu23ExkGTkzra4E2R4p6p4AAb8EMgA4WY1kQjTWbwmAqE1jdwpJ8GX",
}
var matter = MatterCloud.instance(matterOptions)
const BProtocolPrefix = "19HxigV4QyBv3tHpQVcUEQyq1pzZVdoAut"

function SimpleWallet() { // 极简钱包

    this.privateKey = null
    this.address = null
    this.utxos = null
    this.feeRate = null

    /**
     * Must call at running. Can call anytime to refresh UTXOs.
     */
    this.init = async function (privateKeyString, feePerByte) {
        this.privateKey = bsv.PrivateKey.fromString(privateKeyString)
        this.address = this.privateKey.toAddress()
        this.feeRate = feePerByte
        let jsonUtxos = await matter.getUtxos(this.address.toString())
        this.utxos = []
        jsonUtxos.forEach(jsonUtxo => {
            let utxo = new bsv.Transaction.UnspentOutput(jsonUtxo)
            this.utxos.push(utxo)
        });
    }


    this.getBalance = function () {
        let balance = 0
        this.utxos.forEach(utxo => {
            balance += utxo.satoshis
        });
        return balance
    }

    /**
     * dataBuffer: BinaryData in Buffer;
     * mediaType: 'image/png';
     * encoding: 'UTF-8';
     */
    this.archiveBProtocol = async function (dataBuffer, mediaType, encoding, filename) {

        let newTx = new bsv.Transaction()
        newTx.feePerKb(this.feeRate * 1000)
        let inputs = []
        let totalInputValue = 0
        this.utxos.forEach(utxo => {
            inputs.push(utxo)
            totalInputValue += utxo.satoshis
        });
        newTx.from(inputs)
        let opreturnOutputScript = bsv.Script.fromASM(`OP_FALSE OP_RETURN ${Buffer.from(BProtocolPrefix).toString('hex')}`)
        opreturnOutputScript.add(dataBuffer)
        opreturnOutputScript.add(Buffer.from(mediaType))
        opreturnOutputScript.add(Buffer.from(encoding))
        opreturnOutputScript.add(Buffer.from(filename))

        let jsonOpreturnOutput = {
            satoshis: 0,
            script: opreturnOutputScript
        }
        let opreturnOutput = new bsv.Transaction.Output(jsonOpreturnOutput)
        newTx.addOutput(opreturnOutput)

        newTx.change(this.address)

        let signedTx = newTx.sign(this.privateKey)

        let txid = null

        try {
            res = await matter.sendRawTx(signedTx.toBuffer().toString('hex'))
            txid = res.txid
            console.log('Archive successful. txid:', txid)
            console.log(`Check tx https://whatsonchain.com/tx/${txid}`)
            console.log(`Check file on Bico https://bico.media/${txid}`)

            //Substitute UTXOs
            this.utxos = []
            let lastOutput = signedTx.outputs[1]
            let jsonUtxo = {
                "txid": txid,
                "vout": 1,
                "amount": lastOutput.satoshis / 1e8,
                "satoshis": lastOutput.satoshis,
                "value": lastOutput.satoshis,
                "script": lastOutput.script.toHex(),
                "outputIndex": 1
            }
            this.utxos.push(new bsv.Transaction.UnspentOutput(jsonUtxo))//FIXME:

        } catch (error) {
            console.log('ERROR:', error);
        }

        return txid
    }
};
module.exports = SimpleWallet;
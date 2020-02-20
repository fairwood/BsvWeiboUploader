const bsv = require('bsv')
var MatterCloud = require('mattercloudjs')
var matterOptions = {
    api_key: "2aLxRDjQFELKEu23ExkGTkzra4E2R4p6p4AAb8EMgA4WY1kQjTWbwmAqE1jdwpJ8GX",
}
var matter = MatterCloud.instance(matterOptions)
const BProtocolPrefix = "19HxigV4QyBv3tHpQVcUEQyq1pzZVdoAut"

function SimpleWallet(privateKeyString, feePerByte = 0.5) { // 极简钱包

    this.privateKey = bsv.PrivateKey.fromString(privateKeyString)
    this.address = this.privateKey.toAddress()
    if (feePerByte) this.feeRate = feePerByte

    this.utxos = null

    /**
     * Must call at running. Can call anytime to refresh UTXOs.
     */
    this.fetchUTXOs = async function () {
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

    this.withdrawAll = async function (receiverAddresss) {

        let newTx = new bsv.Transaction()
        newTx.feePerKb(this.feeRate * 1000)
        let inputs = []
        this.utxos.forEach(utxo => {
            inputs.push(utxo)
        });
        newTx.from(inputs)
        newTx.change(receiverAddresss)

        let signedTx = newTx.sign(this.privateKey)

        let txid = null

        try {

            res = await matter.sendRawTx(signedTx.toBuffer().toString('hex'))
            txid = res.txid
            console.log(`Withdraw successful. Total: ${signedTx.getChangeOutput().satoshis}sat. txid:`, txid)
            console.log(`Check tx https://whatsonchain.com/tx/${txid}`)

            //Clear UTXOs
            this.utxos = []

        } catch (error) {
            console.log('ERROR:', error);
        }

        return txid
    }

    /**
     * dataBuffer: BinaryData in Buffer;
     * mediaType: 'image/png';
     * encoding: 'UTF-8';
     */
    this.archiveBProtocol = async function (dataBuffer, mediaType, encoding, filename, overrideFeeRate = null) {

        let newTx = new bsv.Transaction()
        let feePerKb = (overrideFeeRate || this.feeRate) * 1000

        newTx.feePerKb(feePerKb)
        let inputs = []
        this.utxos.forEach(utxo => {
            inputs.push(utxo)
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
            let res = await matter.sendRawTx(signedTx.toBuffer().toString('hex'))
            txid = res.txid
            console.log('存档成功。 txid:', txid)
            console.log(`在Bico.Media上查看 https://bico.media/${txid}`)
            console.log(`查看tx信息 https://whatsonchain.com/tx/${txid}`)

            //Substitute UTXOs
            this.utxos = []
            let lastOutput = signedTx.outputs[1]
            if (lastOutput) { // 有可能用完
                let jsonUtxo = {
                    "txid": txid,
                    "vout": 1,
                    "amount": lastOutput.satoshis / 1e8,
                    "satoshis": lastOutput.satoshis,
                    "value": lastOutput.satoshis,
                    "script": lastOutput.script.toHex(),
                    "outputIndex": 1
                }
                this.utxos.push(new bsv.Transaction.UnspentOutput(jsonUtxo))
            }

        } catch (error) {
            console.log('ERROR:', error);
        }

        let result = {
            txid: txid,
            fee: signedTx.getFee()
        }
        return result
    }
};
module.exports = SimpleWallet;
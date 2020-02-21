var fs = require('fs')
var SimpleWallet = require('./SimpleWallet')

module.exports = async function setFeeRate(feeRate) {

    const path = './secret.json'
    let secret = JSON.parse(fs.readFileSync(path).toString())

    secret.FeeRate = feeRate

    let text = JSON.stringify(secret)
    fs.writeFileSync('./secret.json', text)

    console.log("设置成功，当前费率为 " + feeRate + " Sat/Byte");

}
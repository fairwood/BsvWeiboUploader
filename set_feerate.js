var fs = require('fs')
var fileMgr = require('./file-mgr')

const path = fileMgr.SECRET_PATH

module.exports = async function setFeeRate(feeRate) {

    let secret = JSON.parse(fs.readFileSync(path).toString())

    secret.FeeRate = feeRate

    let text = JSON.stringify(secret)
    fs.writeFileSync(path, text)

    console.log("设置成功，当前费率为 " + feeRate + " Sat/Byte");

}
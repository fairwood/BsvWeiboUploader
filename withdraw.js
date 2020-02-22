var fs = require('fs')
var SimpleWallet = require('./SimpleWallet')
var fileMgr = require('./file-mgr')

const path = fileMgr.SECRET_PATH

module.exports = async function withdraw(receiverAddress) {

    let secret = JSON.parse(fs.readFileSync(path).toString())

    let simpleWallet = new SimpleWallet(secret.PrivateKey)

    if (receiverAddress) {

        console.log(`向${receiverAddress}提现所有余额`)

        await simpleWallet.fetchUTXOs().then(async function () {
            balanceBefore = simpleWallet.getBalance()
            console.log(`钱包初始化成功，地址 ${simpleWallet.address.toString()}   余额 ${balanceBefore} sat`)
            await simpleWallet.withdrawAll(receiverAddress)
            console.log('提现完成');
        })
    } else {
        console.log('Missing <address>. Use "node withdraw.js <address>" to withdraw all balance.')
    }
}
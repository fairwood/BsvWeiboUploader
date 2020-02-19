var secret = require('./secret')
var SimpleWallet = require('./SimpleWallet')

let simpleWallet = new SimpleWallet(secret.PrivateKey)

let receiverAddress = process.argv[2]

if (receiverAddress) {

    console.log(`向${receiverAddress}提现所有余额`)

    simpleWallet.fetchUTXOs().then(async function () {
        balanceBefore = simpleWallet.getBalance()
        console.log(`钱包初始化成功，地址 ${simpleWallet.address.toString()}   余额 ${balanceBefore} sat`)
        await simpleWallet.withdrawAll(receiverAddress)
        console.log('提现完成');
    })
} else {
    console.log('Missing <address>. Use "node withdraw.js <address>" to withdraw all balance.')
}
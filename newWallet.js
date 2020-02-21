var fs = require('fs')
var bsv = require('bsv')
var SimpleWallet = require('./SimpleWallet')

module.exports = async function createNewWallet(newPrivateKeyStr, transferOldMoney = true) {

    var priKey
    if (newPrivateKeyStr) {
        priKey = bsv.PrivateKey.fromString(newPrivateKeyStr)
    } else {
        priKey = bsv.PrivateKey.fromRandom()
    }
    var newPriKeyJson = {
        PrivateKey: priKey.toWIF(),
        FeeRate: 0.5
    }
    let newWallet = new SimpleWallet(newPriKeyJson.PrivateKey)
    let newAddress = newWallet.address

    const path = './secret.json'

    //获取旧钱包
    if (fs.existsSync(path)) {
        let secret = JSON.parse(fs.readFileSync(path).toString())

        if (transferOldMoney) {
            
            //转移旧钱包
            let oldWallet = new SimpleWallet(secret.PrivateKey)

            console.log(`正在将旧地址${oldWallet.address.toString()}的余额转移到新地址${newAddress}`)

            await oldWallet.fetchUTXOs().then(async function () {

                balanceBefore = oldWallet.getBalance()

                console.log(`旧钱包初始化成功，余额 ${balanceBefore} sat`)

                if (balanceBefore > 0) {
                    await oldWallet.withdrawAll(newAddress)
                    console.log('余额转移完成');
                } else {
                    console.log('无需转移余额');
                }

            })
        }

        newPriKeyJson.FeeRate = secret.FeeRate || 0.5
    }

    let text = JSON.stringify(newPriKeyJson)
    fs.writeFileSync(path, text)
    console.log(`已创建新钱包，私钥在secret.json`)
    console.log(`新钱包地址 【 ${newAddress} 】`)

}
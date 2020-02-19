var fs = require('fs')
var bsv = require('bsv')
var SimpleWallet = require('./SimpleWallet')


var priKey = bsv.PrivateKey.fromRandom()
var newPriKeyJson = {
    "PrivateKey": priKey.toWIF()
}
let newWallet = new SimpleWallet(newPriKeyJson.PrivateKey)
let newAddress = newWallet.address

let path = './secret.json'

//获取旧钱包
if (fs.existsSync(path)) {
    let secret = JSON.parse(fs.readFileSync(path).toString())

    //转移旧钱包
    let oldWallet = new SimpleWallet(secret.PrivateKey)

    console.log(`正在将旧地址${oldWallet.address.toString()}的余额转移到新地址${newAddress}`)

    oldWallet.fetchUTXOs().then(async function () {

        balanceBefore = oldWallet.getBalance()

        console.log(`旧钱包初始化成功，余额 ${balanceBefore} sat`)
        
        if (balanceBefore > 0) {
            await oldWallet.withdrawAll(newAddress)
            console.log('余额转移完成');
        } else {
            console.log('无需转移余额');
        }

        let text = JSON.stringify(newPriKeyJson)
        fs.writeFileSync('./secret.json', text)
        console.log(`新钱包私钥在secret.json`)
        console.log(`新钱包地址 【 ${newAddress} 】`)
        console.log(`运行 "node deposit.js" 充值`)
    })

} else {

    let text = JSON.stringify(newPriKeyJson)
    fs.writeFileSync('./secret.json', text)
    console.log(`没有找到旧钱包，直接创建新钱包，私钥在secret.json`)
    console.log(`新钱包地址 【 ${newAddress} 】`)
    console.log(`运行 "node deposit.js" 充值`)
}
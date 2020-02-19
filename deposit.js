var secret = require('./secret')
var SimpleWallet = require('./SimpleWallet')

// 可以使用exec 来执行系统的默认命令；child_process为内置模块 
const { exec } = require("child_process");
//传入url
function openUrl(url) {
    // 拿到当前系统的参数
    switch (process.platform) {
        //mac系统使用 一下命令打开url在浏览器
        case "darwin":
            exec(`open ${url}`);
        //win系统使用 一下命令打开url在浏览器
        case "win32":
            exec(`start ${url}`);
        // 默认mac系统
        default:
            exec(`open ${url}`);
    }
}

let simpleWallet = new SimpleWallet(secret.PrivateKey)

let address = simpleWallet.address.toString()

console.log(`钱包地址 【 ${address} 】`)

let qrcodeUrl = `https://cli.im/api/qrcode/code?text=${address}`

openUrl(qrcodeUrl)

simpleWallet.fetchUTXOs().then(async function () {
    balanceBefore = simpleWallet.getBalance()
    console.log(`余额 ${balanceBefore} sat`)
})
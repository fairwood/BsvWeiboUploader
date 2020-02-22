#!/usr/bin/env node

var archiveWeibo = require('../archive-weibo')
var inquirer = require('inquirer')
var fs = require('fs')

const path = './secret.json'
if (fs.existsSync(path)) {
    let secret = JSON.parse(fs.readFileSync(path).toString())
    if (!secret.FeeRate) {
        secret.FeeRate = 0.5
        let text = JSON.stringify(secret)
        fs.writeFileSync(path, text)
    }
} else {
    require('../newWallet')(null, false)
}

async function loop() {
    while (true) {
        await inquirer.prompt([{
            type: "list",
            name: "cmd",
            message: "您需要做什么？",
            choices: [
                { name: '1 开始存证', value: 1, short: '开始存证' },
                //new inquirer.Separator(),
                { name: '2 查看私钥、地址、费率、余额', value: 2 },
                { name: '3 转入资金', value: 3 },
                { name: '4 导入私钥（可选择将旧私钥的钱自动转移到新私钥）', value: 4 },
                { name: '5 使用新的随机私钥（可选择将旧私钥的钱自动转移到新私钥）', value: 5 },
                { name: '6 转出全部余额', value: 6 },
                { name: `7 设置上链费率（默认 0.5 Sat/Byte）`, value: 7 },
            ],
            default: 0
        }]).then(async answer => {
            switch (answer.cmd) {
                case 1: {
                    let condition = true
                    while (condition) {
                        await inquirer.prompt([{
                            type: "input",
                            name: "url",
                            message: "输入微博链接，下一步可选择是否上链图片（如需返回上级菜单，可直接回车）",
                        }]).then(async answer => {
                            if (answer.url.length <= 1) {
                                condition = false
                            } else {
                                let url = answer.url
                                await inquirer.prompt([{
                                    type: "number",
                                    name: "picMode",
                                    message: "选择是否上链图片 0-仅引用 1-上链标准图(默认) 2-上链原图",
                                    default: 1
                                }]).then(async answer => {
                                    condition = await archiveWeibo(url, answer.picMode)
                                })
                            }
                        })
                    }
                    break
                }
                case 2: {
                    await require('../deposit')(true, false)
                    break
                }
                case 3: {
                    await require('../deposit')(false, true)
                    break
                }
                case 4: {
                    await inquirer.prompt([{
                        type: "input",
                        name: "newPrivateKey",
                        message: "输入新私钥",
                    }, {
                        type: "confirm",
                        name: "transferOldMoney",
                        message: "是否转移旧钱包的钱到新钱包？",
                        default: true
                    }]).then(async answer => {
                        await require('../newWallet')(answer.newPrivateKey, answer.transferOldMoney)
                    })
                    break
                }
                case 5: {
                    await inquirer.prompt([{
                        type: "confirm",
                        name: "transferOldMoney",
                        message: "是否转移旧钱包的钱到新钱包？",
                        default: true
                    }]).then(async answer => {
                        await require('../newWallet')(null, answer.transferOldMoney)
                    })
                    break
                }
                case 6: {
                    await inquirer.prompt([{
                        type: "input",
                        name: "receiverAddress",
                        message: "输入收款地址",
                        default: true
                    }]).then(async answer => {
                        await require('../withdraw')(answer.receiverAddress)
                    })
                    break
                }
                case 7: {
                    await inquirer.prompt([{
                        type: "number",
                        name: "feeRate",
                        message: "输入费率（Sat/Byte），建议 0.25 ~ 0.5",
                        default: 0.5
                    }]).then(async answer => {
                        await require('../set_feerate')(answer.feeRate)
                    })
                    break
                }
            }
        })

        console.log();
    }
}
loop()
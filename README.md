# BsvWeiboUploader 0.1 (可用)
 
### 功能：一键将微博完整地存档在 BSV 上

目前需自己在命令行调用main.js脚本来操作，对有技术背景的来说很简单。

支持同时上传微博图片，可选择大图、小图。

**示例**

[多图微博示例](https://bico.media/a50c6f9f48eb598da3496175385d1c41f38e633f157b9f20fb74ed22154f2a00)

[带转发的微博](https://bico.media/268c5dd2639cbb7c273938c662a2dda793ae4ee81fa6d9271b6e49ac1710589c)

[纯文字喊单微博](https://bico.media/4d2680717cb9c7cd9f32a269548d9147babe98c741e7ce5050c5c3815c9bc07c)

## 下载和安装

需要node.js环境。

下载本工程，然后在工程目录运行命令行 ```npm install``` 以安装所有依赖库。

## 第一次使用前需创建或导入私钥

将命令行定位到该工程目录。

运行

```node newWallet.js```

在工程目录会生成secret.json文件，你可以备份里面的使用，也可以替换成自己的私钥。

## 充值和其他钱包操作

### 查看余额和充值

```node deposit.js```

确保该私钥对应的地址有几千sat以上的余额（如果要传图片则需要更多余额）。

### 提现

```node withdraw.js <接收地址>```

提现全部余额，清空钱包。

### 更换私钥

```node newWallet.js```

旧钱包的余额会自动转移到新钱包。

## 修改费率和是否存档图片

1. 费率是main.js里的FEE_RATE，默认0.5是当前所有矿池都会接受的；0.2也可上链，但进块比较慢。

1. PIC_MODE是存档图片的模式。

    - 0 - 不存档而直接引用原图，无图片上链费。但阅读体验较差，图片经常加载不出来。
    - 1 - 存档微博标准图（默认）
    - 2 - 存档微博原图

## 每次存档的操作步骤

### 1. 修改main.js里的URL常量，改为你要存档的博文URL（仅测试过电脑网页端微博URL）。

**注意：必须是单博文页面。可以点击博文的时间进入单独博文页面，然后直接从浏览器复制地址粘贴进来即可**

```
const URL = "https://weibo.com/2803301701/Iuw1wpJWh..."
```

只要包含形如 `'Iuw1wpJWh'` 的id就可以识别，后面的冗余信息无需删除。

### 2. 用node运行main.js

即在命令行先访问到本工程文件夹，然后运行命令：

```
node main.js
```

### 3. 几秒钟之内会上链成功，并输出txid。



<br>

## 相关协议和库

[B Protocol](https://github.com/unwriter/B) unwriter的B协议

[MoneyButton的bsv底层库](https://docs.moneybutton.com) 用于进行密钥、签名等事务相关的操作

[MatterCloud](https://www.mattercloud.net) BSV节点API，用于获取UTXO，广播事务

[Bico.Media](https://bico.media) unwriter的B协议浏览器

[WhatsOnChain](https://whatsonchain.com/) BSV区块浏览器

[C Protocol](https://c.bitdb.network) 用文件哈希索引文件，上传时防止重复。暂时有问题，没用上。
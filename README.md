# 微博存证助手 0.1.1 (可用)
 
### 功能：一键将微博完整地存档在 BSV 上

在命令行运行 main.js，输入微博链接即可自动存档到 BSV 链上。

支持同时上传微博图片，可选择大图、小图。

上链操作极其快捷，存档资料可直接阅读、分享。

联系我：微信stv1024

**示例**

[多图微博示例](https://bico.media/a50c6f9f48eb598da3496175385d1c41f38e633f157b9f20fb74ed22154f2a00)

![](https://github.com/fairwood/BsvWeiboUploader/blob/master/docs/picweibo_demo.png)

[带转发的微博](https://bico.media/268c5dd2639cbb7c273938c662a2dda793ae4ee81fa6d9271b6e49ac1710589c)

[纯文字喊单微博](https://bico.media/4d2680717cb9c7cd9f32a269548d9147babe98c741e7ce5050c5c3815c9bc07c)

## 下载和安装

需要 Node.js 环境。

下载本工程，然后在工程目录运行命令行 ```npm install```。

## 第一次使用前需创建或导入私钥

将命令行定位到该工程目录，

运行 ```node newWallet.js```

<sub>在工程目录会生成secret.json文件，你可以备份里面的私钥，也可以替换成自己的私钥。</sub>

## 充值和其他钱包操作

### 查看余额和充值

```node deposit.js```

<sub>确保该私钥对应的地址有几千sat以上的余额（如果要传图片则需要更多余额）。</sub>

### 提现

```node withdraw.js <接收地址>```

提现全部余额，清空钱包。

### 更换私钥

```node newWallet.js```

旧钱包的余额会自动转移到新钱包。

## 每次存档的操作步骤

### 1. 运行 ```node main.js``` 启动存证助手

将看到命令行等待输入微博链接：

```
E:\git\BsvWeiboUploader> node .\main.js
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
输入微博 URL：（按Ctrl+C退出）
```

### 2. 在网页浏览器复制微博链接。注意：必须是单博文页面，可用如下方式获取

![](https://github.com/fairwood/BsvWeiboUploader/blob/master/docs/right_click_get_link.png)

### 3. 在命令行粘贴微博链接，回车

```
E:\git\BsvWeiboUploader> node .\main.js
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
输入微博 URL：（按Ctrl+C退出）
https://weibo.com/7041692613/IuWXef955?type=comment#_rnd1582120905778
```

<sub>只要包含类似 IuWXef955 这样的id就可以识别，后面的冗余表单信息无需删除。</sub>

### 4. 几秒钟之内会上链成功，并输出txid。

带图片的微博会发出多笔事务，会输出多条事务信息

## 高级：指定本次费率和图片存档模式

在输入微博链接后，可以附带两个参数，依次是：本次图片存档模式、本次上链费率

```
输入微博 URL：（按Ctrl+C退出）
https://weibo.com/7041692613/IuWXef955 0 0.2
```

1. 图片存档模式：

    - 0 ：不存档而直接引用原图，无图片上链费。但阅读体验较差，图片经常加载不出来。
    - 1 ：存档微博小图（默认）
    - 2 ：存档微博原图

1. 上链费率默认 0.5 是当前所有矿池都会接受的费率。

**注意：两个参数都仅影响单次操作。**

<br>

## 相关协议和库

[B Protocol](https://github.com/unwriter/B) unwriter的B协议

[MoneyButton的bsv底层库](https://docs.moneybutton.com) 用于进行密钥、签名等事务相关的操作

[MatterCloud](https://www.mattercloud.net) BSV节点API，用于获取UTXO，广播事务

[Bico.Media](https://bico.media) unwriter的B协议浏览器

[WhatsOnChain](https://whatsonchain.com/) BSV区块浏览器

[C Protocol](https://c.bitdb.network) 用文件哈希索引文件，上传时防止重复。暂时有问题，没用上。
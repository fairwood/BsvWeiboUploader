# 微博存证助手 CLI 0.2
 
### 功能：一键将微博完整地存档在 BSV 上

在命令行输入微博链接即可自动存档到 BSV 链上。

支持同时上传微博图片，可选择大图、小图。存档资料可直接阅读、分享。

联系我：微信 `stv1024`

### 示例

[多图微博示例](https://bico.media/a50c6f9f48eb598da3496175385d1c41f38e633f157b9f20fb74ed22154f2a00)

[![3Z7QdH.md.png](https://s2.ax1x.com/2020/02/20/3Z7QdH.md.png)](https://bico.media/a50c6f9f48eb598da3496175385d1c41f38e633f157b9f20fb74ed22154f2a00)

[带转发的微博](https://bico.media/268c5dd2639cbb7c273938c662a2dda793ae4ee81fa6d9271b6e49ac1710589c)

[纯文字喊单微博](https://bico.media/4d2680717cb9c7cd9f32a269548d9147babe98c741e7ce5050c5c3815c9bc07c)

[转发的长微博，未存档图片](https://bico.media/cb3f593ddb507fac786b3a43a98f9929a5b7e9314717c8d246494c23e8db7058)


## 安装

需要 Node.js 环境。

在命令行输入 ```npm install -g archivesv``` 安装。

## 运行

打开命令行，先 `cd` 到一个可以放置私钥文件的位置（记录事务的文件record.csv也会放置于此）

运行 ```archivesv``` ！

## 复制微博链接时，必须是单博文页面，可用如下方式获取

电脑网页：

![3Z7Mee.png](https://s2.ax1x.com/2020/02/20/3Z7Mee.png)

手机客户端：

![3Z7of1.jpg](https://s2.ax1x.com/2020/02/20/3Z7of1.jpg)

## 图片存档模式说明

    - 0 ：不存档而直接引用原图，无图片上链费。但阅读体验较差，图片经常加载不出来。
    - 1 ：存档微博标准图（默认）
    - 2 ：存档微博原图

## 相关协议和库

[B Protocol](https://github.com/unwriter/B) unwriter的B协议

[MoneyButton的bsv底层库](https://docs.moneybutton.com) 用于进行密钥、签名等事务相关的操作

[MatterCloud](https://www.mattercloud.net) BSV节点API，用于获取UTXO，广播事务

[Bico.Media](https://bico.media) unwriter的B协议浏览器

[WhatsOnChain](https://whatsonchain.com/) BSV区块浏览器

[C Protocol](https://c.bitdb.network) 用文件哈希索引文件，上传时防止重复。暂时有问题，没用上。
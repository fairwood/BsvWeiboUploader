# BSV 微博存证助手 CLI 0.3
 
## 项目背景

1. 解决微博等社交媒体删帖后死无对证的情况，比特币区块链可为每一条媒体信息留下时间戳证明。

1. 为后人记录真实而详尽的历史。

### 功能

- 在命令行输入微博链接即可自动存档到 BSV 链上。

    ![3KqTsA.jpg](https://s2.ax1x.com/2020/02/22/3KqTsA.jpg)

- 支持同时上传微博图片，可选择大图、小图。存档资料可直接阅读、分享。

### 示例

[多图微博示例](https://bico.media/a50c6f9f48eb598da3496175385d1c41f38e633f157b9f20fb74ed22154f2a00)

[![3Z7QdH.md.png](https://s2.ax1x.com/2020/02/20/3Z7QdH.md.png)](https://bico.media/a50c6f9f48eb598da3496175385d1c41f38e633f157b9f20fb74ed22154f2a00)

[带转发的微博](https://bico.media/268c5dd2639cbb7c273938c662a2dda793ae4ee81fa6d9271b6e49ac1710589c)

[纯文字喊单微博](https://bico.media/4d2680717cb9c7cd9f32a269548d9147babe98c741e7ce5050c5c3815c9bc07c)

[转发的长微博，未存档图片](https://bico.media/cb3f593ddb507fac786b3a43a98f9929a5b7e9314717c8d246494c23e8db7058)


## 安装

需要 Node.js 环境。

在命令行输入 ```npm install -g archivesv``` 安装。

## 使用

在命令行运行 ```archivesv``` ！

### 转入资金或导入私钥

本工具在本地维护一个私钥，第一次运行时会随机生成一个私钥，你可以向里面直接转入资金（瞬间到账）。

也可以导入你自己的私钥。

### 复制微博链接时，必须是单博文页面，可用如下方式获取

电脑网页：

![3Z7Mee.png](https://s2.ax1x.com/2020/02/20/3Z7Mee.png)

手机客户端：

![3Z7of1.jpg](https://s2.ax1x.com/2020/02/20/3Z7of1.jpg)

### 图片存档模式说明

    - 0 ：不存档而直接引用原图，无图片上链费。但阅读体验较差，图片经常加载不出来。
    - 1 ：存档微博标准图（默认）
    - 2 ：存档微博原图

### 事务记录和私钥的保存位置

WIN: C:/Users/(user)/AppData/Roaming/archivesv/

OSX: /Users/(user)/archivesv/

Linux: /home/(user)/archivesv/

## Change Log

### v0.3.0 (2020-02-22 23:00 GMT+8)

- 在用户数据文件夹下储存私钥和事务记录文件

- 修复转出资金时命令行顺序不对的bug

### v0.2.4 (2020-02-22 12:00 GMT+8)

- 给图片添加到区块浏览器的链接

- 修复找不到私钥文件的bug

- 修复上链失败的事务也会进入record.csv的bug

### v0.2.3 (2020-02-22 11:20 GMT+8)

- 优化命令行文案

- 修复打开二维码时会打开两次网页的bug

## Related Efforts

[B Protocol](https://github.com/unwriter/B) unwriter的B协议

[MoneyButton的bsv底层库](https://docs.moneybutton.com) 用于进行密钥、签名等事务相关的操作

[MatterCloud](https://www.mattercloud.net) BSV节点API，用于获取UTXO，广播事务

[Bico.Media](https://bico.media) unwriter的B协议浏览器

[WhatsOnChain](https://whatsonchain.com/) BSV区块浏览器

[C Protocol](https://c.bitdb.network) 用文件哈希索引文件，上传时防止重复。暂时有问题，没用上。

## Contributors

Stephen Zhou 微信 `stv1024`

## License

MIT
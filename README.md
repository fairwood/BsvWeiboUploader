# BsvWeiboUploader 0.1 (可用)
 Fast upload a weibo to BSV chain, using B protocol.

目前只能自己运行main.js脚本来上链。

支持同时上传微博图片，可选择大图、小图。

**示例**

[1BSVyHMSR...地址上有大量已存档微博](https://whatsonchain.com/address/1BSVyHMSRomQBTQYY5ugcioakawcSKM43F?sort=desc&limit=5&offset=5) 点击每笔交易的`Decode`按钮即可看到

[单条微博示例](https://bico.media/d9a5be58be40bfd83d0ce2bab4b2eec8d2f9619f148f1fa8c97f24a44ddf4c59)

# 添加私钥文件
在./位置添加一个名为secret.json的文件，格式为
```
{
    "PrivateKey": <Hex或WIF格式私钥>
}
```

确保该私钥对应的地址有几千sat以上的余额（如果要传图片则需要更多余额）。**目前还没有做提现功能，如果你不会写代码，切勿往地址里转太多钱**

（这里也可以填入随机新私钥，然后运行一次main.js会输出对应的地址，再向该地址转一些钱即可。）

# 修改费率和是否存档图片

1. 费率是main.js里的FEE_RATE，默认0.5是当前所有矿池都会接受的；0.2也可上链，但进块比较慢。

1. PIC_MODE是存档图片的模式。

    - 0-不存档而直接引用原图，无图片上链费 
    - 1-微博小图 
    - 2-微博原图

# 每次存证的流程

### 1. 修改main.js里的URL常量，改为你要存档的博文URL（仅测试过电脑网页端微博URL）。

**注意：必须是单博文页面。可以点击博文的时间进入单独博文页面，然后直接从浏览器复制地址粘贴进来即可**

```
const URL = "https://weibo.com/2803301701/Iuw1wpJWh..."
```

只要包含形如 `Iuw1wpJWh` 的id就可以识别，后面的冗余信息无需删除。

### 2. 用node运行main.js
即在命令行先访问到本工程文件夹，然后运行命令：
```
> node "./main.js"
```

### 3. 几秒钟之内会上链成功，并输出txid。

./位置会生成1个微博数据json文件和1个上链内容md文件，都是temp...开头，可以删除。


# 相关协议和库

[B Protocol](https://github.com/unwriter/B) unwriter的B协议

[MoneyButton的bsv底层库](https://docs.moneybutton.com) 用于进行密钥、签名等事务相关的操作

[MatterCloud](https://www.mattercloud.net) BSV节点API，用于获取UTXO，广播事务

[Bico.Media](https://bico.media) unwriter的B协议浏览器

[WhatsOnChain](https://whatsonchain.com/) BSV区块浏览器

[C Protocol](https://c.bitdb.network) 用文件哈希索引文件，上传时防止重复。暂时有问题，没用上。
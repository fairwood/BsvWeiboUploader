# BsvWeiboUploader (暂且可用)
 Fast upload a weibo to BSV chain, using B protocol.

目前只能自己运行main.js脚本来上链

# 添加私钥文件
在./位置添加一个名为secret.json的文件，格式为
```
{
    "PrivateKey": <Hex或WIF格式私钥>
}
```

确保该地址有几千sat以上的余额。

（这里也可以填入新私钥，然后运行一次main.js会输出对应的地址，再向该地址转一些钱即可。）

# 每次存证的流程

1. 修改main.js里的URL常量，改为你要存档的博文URL，仅测试过电脑网页端微博URL。

**注意：必须是单博文页面。可以点击博文的时间进入单独博文页面，然后直接从浏览器复制地址粘贴进来即可**

```
const URL = "https://weibo.com/2803301701/Iuw1wpJWh..."
```

只要包含形如 `Iuw1wpJWh` 的id就可以识别，后面的冗余信息无需删除。

2. 用node运行main.js
即在命令行先访问到本工程文件夹，然后运行命令：
```
> node "./main.js"
```

3. 几秒钟之内会上链成功，并输出txid


# 相关协议和库

[B Protocol](https://github.com/unwriter/B) unwriter的B协议

[MoneyButton的bsv底层库](https://docs.moneybutton.com) 用于进行密钥、签名等事务相关的操作

[MatterCloud](https://www.mattercloud.net) BSV节点API，用于获取UTXO，广播事务

[Bico.Media](https://bico.media) unwriter的B协议浏览器
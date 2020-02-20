var fs = require('fs')

const PATH = './record.csv'

function ArchiveRecord(txid, type, fee, bicoLink, rawLink, abstract) { //这是个构造器
    this.txid = txid
    this.type = type
    this.fee = fee
    this.bicoLink = bicoLink
    this.rawLink = rawLink
    this.abstract = abstract
};
exports.ArchiveRecord = ArchiveRecord

/**
 * @param {ArchiveRecord[]} records - 多条存证记录
 */
exports.checkAndCreateCSV = function () {

    if (!fs.existsSync(PATH)) {
        const titleLine = 'Txid,Type,Fee,Link,RawLink,Abstract\n'
        fs.writeFileSync(PATH, titleLine)
        console.log('首次运行，创建事务记录 record.csv 文件');        
    }

}

/**
 * @param {ArchiveRecord[]} records - 多条存证记录
 */
exports.saveRecordsToCSV = function (records) {

    let text = ''
    records.forEach(record => {
        let abst = record.abstract.replace(/"/g, '""')
        let line = `${record.txid},${record.type},${record.fee},${record.bicoLink},${record.rawLink},"${abst}"\n`
        text += line
    });
    
    fs.appendFile(PATH, text, () => { })
}
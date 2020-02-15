var bsv = require('bsv')
var priKey = bsv.PrivateKey.fromRandom()
var pubKey = priKey.toPublicKey()
var address = pubKey.toAddress()
console.log(priKey, pubKey, address)

for (let i = 0; i < 1e7; i++) {
    priKey = bsv.PrivateKey.fromRandom()
    let addr = priKey.toAddress().toString()
    if (i % 1e3 == 0) console.log(`${i}次`);
    if (addr.substr(1, 3).toLowerCase() == 'bsv') {
        console.log(priKey, priKey.toPublicKey(), priKey.toAddress())
        break;
    }
}
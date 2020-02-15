var bsv = require('bsv')
var BN = require('bn.js')
// var priKey = bsv.PrivateKey.fromRandom()
// var pubKey = priKey.toPublicKey()
// var address = pubKey.toAddress()
// console.log(priKey, pubKey, address)

var n = bsv.PrivateKey.fromRandom().toBigNumber()
for (let i = 0; i < 1e7; i++) {
    n = n.addn(1)
    priKey = bsv.PrivateKey.fromObject(n)
    let addr = priKey.toAddress().toString()
    //if (i % 1e4 == 0) console.log(`${i}次`);
    if (addr.substr(1, 3) == 'BSV') {
        console.log(priKey, priKey.toPublicKey(), priKey.toAddress())
    }
}
var bsv = require('bsv')
var NodeAPI = require('./NodeAPI')
var secret = require('./secret')

// NodeAPI.getUTXOs(secret.Address, (ch) => { console.log(ch) })


//NodeAPI.getTx('5e3014372338f079f005eedc85359e4d96b8440e7dbeb8c35c4182e0c19a1a12', (ch) => { console.log(ch) })

var address = bsv.Address.fromString(secret.Address)

var script = bsv.Script.fromAddress(address)

//console.log(script.toASM())
// 'OP_DUP OP_HASH160 e2a623699e81b291c0327f408fea765d534baa2a OP_EQUALVERIFY OP_CHECKSIG'
script = bsv.Script.fromString('14')
console.log(script.toHex())
// '76a914e2a623699e81b291c0327f408fea765d534baa2a88ac'
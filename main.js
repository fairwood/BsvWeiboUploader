var NodeAPI = require('./NodeAPI')
var sec = require('./secret')
console.log(sec)
NodeAPI.getUTXOs('12XXBHkRNrBEb7GCvAP4G8oUs5SoDREkVX', (ch) => { console.log(ch) })


NodeAPI.getTx('5e3014372338f079f005eedc85359e4d96b8440e7dbeb8c35c4182e0c19a1a12', (ch) => { console.log(ch) })
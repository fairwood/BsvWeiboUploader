var bsv = require('bsv')
var BN = require('bn.js')
var MatterCloud = require('mattercloudjs')
var NodeAPI = require('./NodeAPI')
var secret = require('./secret')


NodeAPI.getTx('bb234213fda41aebed56a866427e9ab1456bf426daeaf0105d6f86bca18d2db4', (res) => { console.log(res) })


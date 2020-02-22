
exports.DIR0 = process.env.APPDATA || process.env.HOME
exports.DIR = exports.DIR0 + '/archivesv'
exports.SECRET_PATH = exports.DIR + '/secret.json'
exports.RECORD_PATH = exports.DIR + '/record.csv'
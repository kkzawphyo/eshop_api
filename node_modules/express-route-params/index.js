var extend = require('./lib');

var info = require('./package.json');

with(info)
	module.exports = Object.assign(extend, {version})

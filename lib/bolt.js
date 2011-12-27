var Storm = require('./storm.js'),
	util = require('util');


var Bolt = function() {};

util.inherits(Bolt, Storm);

Bolt.prototype.tupleCallback = function(tuple, self) {
	self.process(tuple, self);
	
	self.sync();
};

module.exports = Bolt;
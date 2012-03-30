var Storm = require('./storm.js'),
	util = require('util');

function BasicBolt() {
	//Empty Constructor
}

util.inherits(BasicBolt, Storm);

BasicBolt.prototype.tupleCallback = function(tuple, self) {
	self.anchoringTuple = tuple;
	
	var callback = function() {
		self.ack(tuple, self);
	};
	
	self.process(tuple, callback, self);
};

module.exports = BasicBolt;

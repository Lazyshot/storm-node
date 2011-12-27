var Storm = require('./storm.js'),
	util = require('util');

function BasicBolt() {
	//Empty Constructor
}

util.inherits(BasicBolt, Storm);

BasicBolt.prototype.tupleCallback = function(tuple, self) {
	self.anchoringTuple = tuple;
	
	self.process(tuple, self);
	
	self.ack(tuple, self);
	
	self.sync();
};

module.exports = BasicBolt;

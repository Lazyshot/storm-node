var Storm = require('../../storm-node');


var SplitSentenceBolt = Storm.Bolt;

SplitSentenceBolt.prototype.process = function(tuple, self) {
	self.emit(tuple.tuple[0].split(" "), self);
};

var ssb = new SplitSentenceBolt();

ssb.run();
#Package

###storm-node

#Example

	var SplitSentenceBolt = Storm.Bolt;

	SplitSentenceBolt.prototype.process = function(tuple, self) {
		self.emit(tuple.tuple[0].split(" "), self);
	};

	var ssb = new SplitSentenceBolt();

	ssb.run();

#Known Issues

*	Issue with BasicBolt using anchored emits

#Author

Bryan Peterson - @lazyshot
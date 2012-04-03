#Package

###storm-node

#Example

	var SplitSentenceBolt = Storm.Bolt;

	SplitSentenceBolt.prototype.process = function(tuple, self) {
		var words = tuple.tuple[0].split(" ");
	
		for(var i = 0; i < words.length; i++)
		{
			self.emit([words[i]], self);
		}
	};

	var ssb = new SplitSentenceBolt();

	ssb.run();

#Known Issues

*	Issue with BasicBolt using anchored emits

#Author

Bryan Peterson - @lazyshot
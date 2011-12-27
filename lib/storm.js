var util = require('util'),
	fs = require('fs');


var Storm = function(){
};

Storm.prototype = {
	msgCount: 0,
	stormConfig: {},
	topologyContext: {},
	anchoringTuple: null,
	
	tupleCallback: function(tuple, self) {
		
		process.stdout.write("Process tuple here: " + tuple.tuple + " \n")
	
	},
	
	sync: function() {
		process.stdout.write("sync\n");
	},
	
	ack: function(tuple, self) {
		self.sendCommand({
			command: 'ack',
			id: tuple.id
		});
	},
	
	fail: function(tuple, self) {
		self.sendCommand({
			command: 'fail',
			id: tuple.id
		});
	},
	
	sendCommand: function(command) {
		process.stdout.write(JSON.stringify(command) + "\nend\n");
	},
	
	emit: function(tuple, self) {
		self.emitTuple(tuple, null, [], null, self)
	},
	
	emitTuple: function(tuple, stream, anchors, directTask, self) {
		var command = {
			command: 'emit'
		};
		
		if(self.anchoringTuple != null)
		{
			anchors = [self.anchoringTuple];
		}
		
		if(stream != null)
			command.stream = stream;
			
		if(anchors != null)
			command.anchors = anchors.map(function(a) { return a.id; });
			
		if(directTask != null)
			command.task = directTask;
		
		command.tuple = tuple;
			
		self.sendCommand(command);
	},
	
	sendPid: function(dir) {
		try {
			fs.writeFileSync(dir + '/' + process.pid);
		} catch(e) {
			//do nothing - issue creating pid file
		}
		
		process.stdout.write(process.pid + "\n");
	},
	
	parseMessage: function(msg, self) {
		self.msgCount++;
		
		if(self.msgCount == 1) {
			self.sendPid(msg);
		} else if(self.msgCount == 2) {
			self.stormConfig = JSON.parse(msg);
		} else if(self.msgCount == 3) {
			self.topologyContext = JSON.parse(msg);
		} else {
			tuple = {};
			
			try {
				tuple = JSON.parse(msg);
			} catch(err) {
				//process.stdout.write("Malformed STDIN: " + msg);
				//malformed stdin - error check here
			}
			
			if('tuple' in tuple)
			{
				self.tupleCallback(tuple, self);
			}
		}
	
	},
	
	readMessages: function(self){
		process.stdin.setEncoding("utf8");
		msgs = [];
		
		process.stdin.on('data', function(chunk){
			var chunks = chunk.split("\n");
			var last_end = 0;
			
			msgs = msgs.concat(chunks)
			
			for(i in msgs)
			{
				if(msgs[i] == "end")
				{
					self.parseMessage(msgs.slice(last_end, i).join("\n"), self);
					last_end = parseInt(i) + 1;
				}
			}
			
			msgs.splice(0, last_end);
			
		});
		
		process.stdin.resume();
	},
	
	run: function(){
	
		this.readMessages(this);
	
	}
}

module.exports = Storm;
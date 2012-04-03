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
		
		self.log("Process tuple here: " + tuple.tuple);
	
	},
	
	ack: function(tuple, self) {
		self.sendCommand({
			command: 'ack',
			id: tuple.id
		}, self);
	},
	
	fail: function(tuple, self) {
		self.sendCommand({
			command: 'fail',
			id: tuple.id
		}, self);
	},
	
	log: function(msg, self) {
		self.sendCommand({
			command: 'log',
			msg: msg
		}, self);
	},
	
	sendToParent: function(msg, self) {
        var str = msg + "\nend\n";
        process.stdout.write(str);
	},
	
	sendCommand: function(command, self) {
		self.sendToParent(JSON.stringify(command), self);
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
			
		self.sendCommand(command, self);
	},
	
	sendPid: function(dir, self) {
		try {
			fs.writeFileSync(dir + '/' + process.pid);
		} catch(e) {
			//do nothing - issue creating pid file
		}
        
        process.on('uncaughtException', function(e){
            process.stdout.write(e);
        });
        
        process.on('exit', function(){
            process.stdout.write("Exiting");
        });
        
        self.sendCommand({pid: process.pid}, self);
	},
	
	parseMessage: function(msg, self) {
		self.msgCount++;
		
		if(self.msgCount == 1) {
			data = JSON.parse(msg);
            self.sendPid(data.pidDir, self);
            self.stormConfig = data.config;
            self.topologyContext = data.context;
		} else {
			tuple = {};
			
			try {
				tuple = JSON.parse(msg);
			} catch(err) {
				process.stdout.write("Malformed STDIN: " + msg);
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
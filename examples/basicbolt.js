var Storm = require('../../storm-node');

var TestBolt = Storm.BasicBolt;

TestBolt.prototype.process = function(tuple, done, self) {
      self.emit(["val1","val2"], self);
      done();
};

var bolt = new TestBolt();

bolt.run();

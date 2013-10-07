
function NwSpsc(spscExec, playerExec) {
	this.spsc = null;
	this.player = null;
	this.error = null;
	
	this.playerExec = playerExec;
	this.spscExec = spscExec;
}

NwSpsc.prototype.on = function(evt, func){
	if (evt ==  'error') {
		this.error = func;
	}
}

function testSocket(nwspsc)
{
	var net = require('net');
	
	var testClient = net.connect({port: 8908}, function() { //'connect' listener
		console.log('client connected');
		testClient.end();
		nwspsc.doPlay();
	});
	
	testClient.on('error', function(e){
		console.log('connect error\n');
		testClient.destroy();
		setTimeout(testSocket, 1000, nwspsc);
	});
	testClient.on('end', function(e){
		console.log('connect end\n');
	});
}

//sop://broker.sopcast.com:3912/147439
NwSpsc.prototype.play = function(spscAddr) {
	var me = this;
	var cp = require('child_process');
	
	
	if (me.spsc || me.player) {
		console.log("\n");
		return -1;
	}
	
	me.spsc = cp.spawn(me.spscExec, [spscAddr, '3908', '8908']);
	if (!me.spsc) {
		console.log("\n");
		return -1;
	}

	me.spsc.on('close', function(code) {
		console.log("sp-sc exited, code = "+code);
		me.spsc = null;
		me.stop();
	});
	
	me.spsc.stdout.on('data', function (data) {
		console.log('sp-sc-auth stdout: ' + data);
	});
	//todo: start connect to the asf server, when socket available start player
	
	setTimeout(testSocket, 1000, me);
}

NwSpsc.prototype.doPlay = function() {
	var me = this;
	var cp = require('child_process');
	
	
	if (me.player) {
		console.log("\n");
		return -1;
	}
	
	me.player = cp.spawn(me.playerExec, ['http://localhost:8908/tv.asf']);
	if (!me.player) {
		console.log("\n");
		return -1;
	}

	me.player.on('close', function(code) {
		console.log("player exited, code = "+code);
		me.player = null;
		me.stop();
	});
	
	me.player.stdout.on('data', function (data) {
		console.log('sp-sc-auth stdout: ' + data);
	});
	
}


NwSpsc.prototype.stop = function(){
	var me = this;
	
	console.log("");
	if (me.player) {
		me.player.kill('SIGINT');
	}
	if (me.spsc) {
		console.log("");
		me.spsc.kill('SIGKILL');
	}
}

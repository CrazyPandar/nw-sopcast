
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

//sop://broker.sopcast.com:3912/147439
NwSpsc.prototype.play = function(spscAddr) {
	var cp = require('child_process');
	
	if (this.spsc || this.player) {
		console.log("\n");
		return -1;
	}
	
	this.spsc = cp.spawn(this.spscExec, [spscAddr, '3908', '8908']);
	if (!this.spsc) {
		return -1;
	}

	spsc.on('close', function(code) {
		console.log("sp-sc exited, code = "+code);
		this.spsc = NULL;
		this.stop();
	});
	
	//todo: start connect to the asf server, when socket available start player
}

NwSpsc.prototype.stop = function(){
	if (this.player) {
		this.player.kill('SIGINT');
	}
	if (this.spsc) {
		this.spsc.kill('SIGINT');
	}
}

var aneObj = function function_name() {
	// body...
	this.x = [];
	this.y = [];
}
aneObj.prototype.num = 50;
aneObj.prototype.init = function() {
	// body...
	for (var i = 0; i < this.num; i++) {
		this.x[i] = i * 10 + Math.random() * 20;
		this.len[i]=200+Math.random()*50;
	}
}
aneObj.prototype.draw = function() {
	// body...
}
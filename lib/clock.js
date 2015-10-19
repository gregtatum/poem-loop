var MAX_DT = 60
var MIN_DT = 1000 / 60

function _delta( maxDt, minDt ) {
	var newTime, dt

	newTime = Date.now()
	dt = newTime - this.now

	dt = Math.min( dt, MAX_DT )
	dt = Math.max( dt, MIN_DT )

	this.elapsed += dt
	this.now = newTime

	return dt
}

function _start() {
	this.now = Date.now()
}

function _reset() {
	this.now = 0
	this.elapsed = 0
}

function _getValue( key ) {
	return this[key]
}

module.exports = function clock() {

	var state = {
		now : 0,
		elapsed : 0
	}
	
	return {
		start	: _start.bind( state ),
		reset	: _reset.bind( state ),
		now		: _getValue.bind( state, "now" ),
		elapsed	: _getValue.bind( state, "elapsed" ),
		delta	: _delta.bind( state ),
	}
}

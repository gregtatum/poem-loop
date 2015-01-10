var _ = require('lodash');

var delta = function( maxDt, minDt ) {
	
	return function() {
		var newTime, dt;
	
		newTime = Date.now();
		dt = newTime - this.now;
	
		dt = Math.min( dt, maxDt );
		dt = Math.max( dt, minDt );
	
		this.elapsed += dt;
		this.now = newTime;
	
		return dt;
	};
}

var start = function() {
	this.now = Date.now();
};

var reset = function() {
	this.now = 0;
	this.elapsed = 0;
};

var getValue = function( key ) {
	return function() {
		return this[key];
	};
};

var clock = function( properties ) {

	var config = _.extend({
		maxDt : 60,
		minDt : 16.66666667,
		autostart : false
	}, properties);
	
	var state = Object.preventExtensions({
		now : 0,
		elapsed : 0
	});

	if(config.autostart !== false) {
		start.bind( state )();
	}
	
	return {
		start	: start.bind( state ),
		reset	: reset.bind( state ),
		now		: getValue("now").bind( state ),
		elapsed	: getValue("elapsed").bind( state ),
		delta	: delta( config.maxDt, config.minDt ).bind( state ),
	}
};

module.exports = clock;
var raf = require('raf');
var EventEmitter = require('events').EventEmitter;
var Extend = require('lodash.assign');
var clock = require('./clock')();

var start = function( loop, clock ) {
	
	return function() {
		if( !this.started ) {
			if( !this.clockStarted ) {
				clock.start()
			}
			loop()
			this.started = true
		}
	}
		
}

var stop = function() {
	raf.cancel( this.rafHandle )
	this.started = false
}

var createLoop = function( emitter, clock, customizeEvent ) {
	
	return function runLoop() {
		
		this.rafHandle = raf( runLoop.bind(this) )
		var dt = clock.delta()
		
		var event = customizeEvent({
			dt: dt,
			unitDt: dt / 16.66666667,
			now: clock.now(),
			elapsed: clock.elapsed()
		})
		
		emitter.emit("update", event)
		emitter.emit("updatedone", event)
		emitter.emit("draw", event)
		emitter.emit("drawdone", event)
		
	}
	
}

var passThrough = function( a ) { return a }

module.exports = function configurePoemLoop( properties ) {

	var config = Extend({
		emitter: new EventEmitter(),
		customizeEvent: passThrough
	}, properties)
	
	var state = Object.preventExtensions({
		clockStarted : false,
		started: false,
		rafHandle: null
	})
	
	var loop = createLoop(
		config.emitter,
		clock,
		config.customizeEvent
	)
	.bind( state )
	
	return {
		start	: start( loop, clock ).bind( state ),
		stop	: stop.bind( state ),
		reset	: clock.reset,
		emitter : config.emitter
	}
	
}
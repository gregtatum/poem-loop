var Raf = require('./raf')()
var EventEmitter = require('events').EventEmitter
var CreateClock = require('./clock')

function _startFn( loop, clock, current ) {
	
	return function start() {
		if( !current.started ) {
			if( !current.clockStarted ) {
				clock.start()
			}
			loop()
			current.started = true
		}
	}
}

function _stopFn( current ) {
	
	return function stop() {
		Raf.cancel( current.rafHandle )
		current.started = false
	}
}

function _loopFn( emitter, clock, customizeEvent, current ) {
	
	// Share event to minimize garbage collection
	var event = {
		dt      : 0,
		unitDt  : 0,
		now     : 0,
		elapsed : 0
	}
	
	return function runLoop() {
		
		current.rafHandle = Raf.invoke( runLoop )
		
		event.dt      = clock.delta(),
		event.unitDt  = event.dt / 16.66666667,
		event.now     = clock.now(),
		event.elapsed = clock.elapsed()
		
		customizeEvent( event )
		
		emitter.emit("update", event)
		emitter.emit("updatedone", event)
		emitter.emit("draw", event)
		emitter.emit("drawdone", event)
	}
}

var passThrough = function( a ) { return a }


module.exports = function configurePoemLoop( props ) {
	
	var emitter, customizeEvent
	
	if( typeof props === "object" ) {
		emitter = props.emitter
		customizeEvent = props.customizeEvent
	}
	emitter        = emitter        ? emitter        : new EventEmitter()
	customizeEvent = customizeEvent ? customizeEvent : passThrough       
	
	var clock          = CreateClock()
	
	var current = {
		clockStarted : false,
		started: false,
		rafHandle: null
	}
	
	var loop = _loopFn( emitter, clock, customizeEvent, current )
	
	return {
		start	: _startFn( loop, clock, current ),
		stop	: _stopFn( current ),
		reset	: clock.reset,
		emitter : emitter
	}
}
function _getNativeRAF() {
	
	var raf = window.requestAnimationFrame
	var cancel = window.cancelAnimationFrame
	var vendors = ['ms', 'moz', 'webkit', 'o']
	
	for( var x = 0; !raf && x < vendors.length; ++x ) {
		raf = window[vendors[x]+'RequestAnimationFrame']
		cancel = window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame']
	}
	
	return {
		invoke : raf.bind(window),
		cancel : cancel.bind(window)
	}
}

function _invokeFn() {
	
	var lastTime = 0
	
	return function invoke(callback, element) {
		
		var currTime   = new Date().getTime()
		var timeToCall = Math.max(0, 16 - (currTime - lastTime))
		
		var id = window.setTimeout(function() {
			callback(currTime + timeToCall)
		}, timeToCall)
		
		lastTime = currTime + timeToCall
		
		return id
	}
}

function _cancel( id ) {
	clearTimeout( id )
}

module.exports = function createRAF() {
	
	var raf = _getNativeRAF()
 
 	raf.invoke = raf.invoke ? raf.invoke : _invokeFn()
 	raf.cancel = raf.cancel ? raf.cancel : _cancel()
	
	return {
		invoke : function( callback ) {
			return raf.invoke( callback )
		},
		cancel : function cancel( id ) {
			raf.cancel( id )
		}
	}
}
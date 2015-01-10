var loop = require('./lib/loop')({
	
	customizeEvent : function( event ) {
		
		event.callCount = ++this.iterator;
		return event;
		
	}.bind({ iterator : 0 })
	
});

loop.emitter.on('update', function( e ) {
	console.log(e);
});

loop.start()

setTimeout(function() {
	loop.stop();
}, 1000);
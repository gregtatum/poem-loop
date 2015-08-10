# poem-loop

This module is a configurable event loop for visualizations, demos, experiments, art, and poems. It provides an `update` and `draw` event, as well as `updatedone` and `drawdone`. It uses the [raf](https://www.npmjs.com/package/raf) module for the requestAnimationFrame.

Part of the [programming-poem](https://www.npmjs.com/browse/keyword/programming-poem) module series.

## Usage

Its primary intended use is with [Browserify](http://browserify.org/).

From the command line:

	npm install poem-loop --save

Then in your code:

	var loop = require('poem-loop')( configuration );
	
	loop.start();
	
	loop.emitter.on('update', function( e ) {
		box.position.x += e.dt;
		gameClock.text( e.elapsed );
	});
	
	loop.emitter.on('draw', function( e ) {
		renderer.render();
	});
	
## Event object

The event object has the following values.

 * `dt` - The change in time in milliseconds.
 * `unitDt` - The change in time as a unit interval (0-1). Assumes 1 is equal to 16.6666 milliseconds.
 * `now` - The current Date.now() in milliseconds.
 * `elapsed` - The elapsed game time in milliseconds, starts at 0. Does not increment when the loop is stopped.

## Configuration

The loop can be configured.

	var loop = require('poem-loop')({
		emitter: poemEmitter,
		customizeEvent : function( event ) {
			event.mousePosition = getMousePosition();
			return event;
		}
	});

#### `emitter`

A node.js EventEmitter. If one is set, it is used by the loop. Otherwise a new EventEmitter is created.

#### `customizeEvent`

A function that customizes the event object that is passed to the update and draw event. It gets passed the object and should return the object.

## Interface

#### `loop.start()`

Start the loop.

#### `loop.stop()`

Stops the loop but doesn't reset the elapsed time.

#### `loop.reset()`

Resets the elapsed time.

#### `loop.emitter`

The event emitter.
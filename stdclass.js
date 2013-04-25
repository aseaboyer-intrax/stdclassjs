(function()
{
	"use strict";

	function isCallable( thing )
	{
		return !!( thing && thing.constructor && thing.call && thing.apply );
	}

/* BEGIN CLASS: StdClass */
	function StdClass() {}
	StdClass.extend = function( ctor )
	{
		if ( typeof ctor === 'undefined' )
		{
			var SuperConstructor = this;
			ctor = function()
			{
				return SuperConstructor.apply( this, arguments );
			};
		}
		else if ( !isCallable( ctor ) )
		{
			throw new Error( "Expecting function" );
		}

		ctor.parent = this.prototype;

		function Super() {}
		Super.prototype = ctor.parent;
		ctor.prototype = new Super();
		ctor.prototype.constructor = ctor;

		if ( isCallable( this.mixin ) )
			this.mixin( ctor );
		else
			StdClass.mixin( ctor );

		return ctor;
	};
	StdClass.implement = function( /* ... */ )
	{
		var i = 0,
			i_max = arguments.length,
			prop;

		for ( ; i < i_max; ++i )
		{
			if ( !( arguments[i] instanceof Object ) )
				continue;

			for ( prop in arguments[i] )
			{
				/* jshint eqnull: true */
				if ( arguments[i][prop] == null )
					continue;

				this.prototype[prop] = arguments[i][prop];
			}
		}

		return this;
	};
	StdClass.mixin = function( ctor )
	{
		if ( !( ctor && ctor.constructor && ctor.call && ctor.apply ) )
			throw new Error( "Expecting function" );

		if ( isCallable( this.extend ) )
			ctor.extend = this.extend;
		else
			ctor.extend = StdClass.extend;

		if ( isCallable( this.implement ) )
			ctor.implement = this.implement;
		else
			ctor.implement = StdClass.implement;

		return ctor;
	};
	StdClass.prototype.toString = function()
	{
		return "[object StdClass]";
	};
/* END CLASS: StdClass */

	if ( typeof module !== 'undefined' )
		module.exports = StdClass;
	else if ( typeof global !== 'undefined' )
		global.StdClass = StdClass;
	else if ( typeof window !== 'undefined' )
		window.StdClass = StdClass;
	else
		return StdClass;

}());

/*
The MIT License (MIT)

Copyright (c) 2013 Christopher Ackerman

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

StdClassJS
==========

A dead simple JavaScript inheritance implementation.

Node
----

_Install With NPM_

    $ npm install stdclass

_Unit Testing (optional)_

    $ npm install --dev stdclass
    $ npm test stdclass

_Require It_

    #!/usr/bin/env node
    var StdClass = require( 'stdclass' );

Browser
-------

    <script src="/path/to/stdclass.js"></script>

Inline
------

Feel free to copy the source between `/* BEGIN CLASS: StdClass */` and `/* END CLASS: StdClass */` into your own project. Remember to include the license.

Usage
-----

The StdClass constructor has three static methods that do all the magic.

* `extend`
    * takes an optional constructor function as an argument.
    * If no argument is given, then the parent constructor will be inherited.
    * Returns the constructor.
* `extendProto`
    * Takes 0 or more objects as arguments.
        * Passing no objects is silly, but allowed.
    * _All_ non-null/non-undefined properties on _all_ objects passed to extendProto will be added to the class constructor prototype.
    * Returns the constructor.
* `mixin`
    * Takes a constructor function argument.
    * Attaches the `extend` and `extendProto` methods to the constructor which can then be used to extend the class.
    * Useful for adding StdClass inheritance to classes that cannot directly inherit from StdClass.

The `extend` and `extendProto` static methods are also copied to child classes so that children can be re-extended in turn.

    // Parent class
    var MyParent = StdClass.extend( function( args, go, here )
    {
        // Do parent constructor stuff
    })
    .extendProto({
        instanceMethod: function( and, here )
        {
            // Do method stuff
        }
    });

    // Child class
    var MyChild = MyParent.extend( function( args, go, here, too )
    {
        // Call the parent constructor
        MyParent.call( this, args, go, here );

        // Do child constructor stuff
        this.too = too;
    })
    .extendProto({
        instanceMethod: function( and, here, too )
        {
            // Call the parent method
            MyParent.prototype.instanceMethod.call( this, and, here );

            // Do child method stuff
            this.too = too;
        },
        newMethod: function()
        {
            // Do new method stuff
        }
    });

    // No explicit constructor means inherit the parent constructor.
    var InheritedConstructor = MyChild.extend();

    // extendProto with multiple arguments
    InheritedConstructor.extendProto(
        {
            foo: 'foo', // Replaced below
            bar: 'bar', // Not replaced below
        },
        {
            foo: 'foo2', // Replaces above 'foo' value
            bar: null // Does not replace above 'bar' value
        }
    )

    var DumbClass = function()
    {
        // Assume this is somebody elses class that you've included in your
        // project. It doesn't have any built in way of extending it! You'll
        // have to do it the old fashioned way... or will you?
    };

    StdClass.mixin( DumbClass );

    // Woot!
    var NotSoDumbClass = DumbClass.extend();

License
-------

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

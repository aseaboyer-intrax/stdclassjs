StdClassJS
==========

A dead simple JavaScript inheritance implementation.

Inheritance is done exactly the same way it would be done manually so instanceof will still work and there is no speed reduction. It's all just wrapped up in some helper methods so the repetative boilerplate can be avoided.

It Does Not...
--------------

* Do multiple inheritance
* Add _super/_superApply methods
* Use Object.create or anything that is only in ECMAScript "newer than you can use" Edition.
* Juggle

You Can...
----------

### Use It With Node

_Install With NPM_

    $ npm install stdclass

_Unit Testing (optional)_

    $ npm install --dev stdclass
    $ npm test stdclass

_Require It_

    #!/usr/bin/env node
    var StdClass = require( 'stdclass' );

### Use It In The Browser

    <script src="/path/to/stdclass.js"></script>

### Use It Inline

There are no dependencies and the source is small, so feel free to copy the source into your own project adding a seperate file seems cumbersome. Remember to include the license. I recommend just grabbing the source between `/* BEGIN CLASS: StdClass */` and `/* END CLASS: StdClass */`.

API
---

StdClass has three static methods that do all the magic.

* `extend( [ Function constructor ] )`
    * Creates a child class that inherits from the constructor that extend is being statically called on.
    * Takes an optional constructor function as an argument.
    * If no argument is given, then the parent constructor will be inherited.
    * Calls mixin to copy the `extend` and `implement` static methods to the new child class.
    * Returns the constructor.
* `implement( [ Object, ... ] )`
    * Add properties to the class prototype.
    * _All_ non-null/non-undefined properties on _all_ objects passed to implement will be added to the class constructor prototype.
    * Takes 0 or more objects as arguments.
        * Passing no objects is silly, but allowed.
    * Returns the constructor.
* `mixin( Function constructor )`
    * Takes a required constructor function argument.
    * Attaches the `extend` and `implement` static methods which can then be used to extend the class.
    * Useful for adding StdClass inheritance to classes that cannot directly inherit from StdClass.
    * Returns the constructor.

The `mixin` method is _not_ copied by either `mixin` or `extend`; however, it can be manually copied should you want to extend the functionality of StdClass itself.

A reference to the parent class prototype is also statically attached for convenience so that you can reference parent methods without refering to the parent by name. This helps avoid refactoring if your parent class changes or is renamed.

* `parent`
    * `Child.parent === Parent.prototype`
    * This is a shortcut allowing access to the parent class prototype object without referencing the parent class by name.

You can of course still use the parent class name if you prefer.

Examples
--------

    // Parent class
    var MyParent = StdClass.extend( function( args, go, here )
    {
        // Do parent constructor stuff
    })
    .implement({
        instanceMethod: function( and, here )
        {
            // Do method stuff
        }
    });

    // Child class
    var MyChild = MyParent.extend( function( args, go, here, too )
    {
        // Call the parent constructor
        MyChild.parent.constructor.call( this, args, go, here );

        // The above is equivalent the following, but has the advantage of
        // not using the parent name. This can save time refactoring should the
        // parent class change or be renamed.
        //
        // MyParent.prototype.constructor.call( this, args, go, here );
        //   OR
        // MyParent.call( this, args, go, here );

        // Do child constructor stuff
        this.too = too;
    })
    .implement({
        instanceMethod: function( and, here, too )
        {
            // Call the parent method
            MyChild.parent.instanceMethod.call( this, and, here );

            // Once again, the above is equivalent to the following except that
            // you don't need to use the parent class name.
            //
            // MyParent.prototype.instanceMethod.call( this, and, here );

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

    // implement with multiple arguments
    InheritedConstructor.implement(
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

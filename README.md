StdClassJS
==========

A dead simple JavaScript inheritance implementation.

Inheritance is done exactly the same way it would be done manually so instanceof will still work and there is no speed reduction. It's all just wrapped up in some helper methods so the repetative boilerplate can be avoided.

This is a _library_, even though it looks a little like a _framework_. See the "Notes" section for more information.

It Does Not...
--------------

* Do multiple inheritance.
    * Can of worms.
    * This library is designed to make it easier to use existing language features, not add new ones.
    * See the "Notes" section if you think JavaScript _does_ support multiple inheritance.
* Handle, promote, or propagate any specific means of making methods/properties private/protected.
    * Useful constructs, but enforcement is not useful overhead. Agree to a pattern such as "_ prefixed methods are protected", and move on.
* Add &#95;super/&#95;superApply methods.
    * It _does_ add a static reference to the parent prototype of a constructor, but it's passive and reasonably non-invasive.
* Wrap any methods.
    * "What about the constructor?" __nope__
    * "What about ..." __NO__
    * Any wrapping of anything would create overhead and side effects. Do it yourself if you want to.
* Break if you modify your classes outside of its pervue.
    * Feel free to modify prototypes, attach properties willy-nilly, or extend StdClass classes any way you want.
* Break instanceof or require a third-party way of checking pedigree.
* Use Object.create or anything that is only in ECMAScript "newer than your environment supports" Edition.
* Use any deprecated ECMAScript features.
* Use any reserved words.
* Juggle.
    * This was a tough decision, but in the end I had to conclude it wasn't worth the effort.

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

There are no dependencies and the source is small, so feel free to copy the source into your own project if adding a seperate file seems cumbersome. Remember to include the license. I recommend just grabbing the source between `/* BEGIN CLASS: StdClass */` and `/* END CLASS: StdClass */`.

API
---

StdClass and any derivative constructors it creates/modifies, have the following static methods that do all the magic.

* `extend( [ Function constructor ] )`
    * Creates a child class of the constructor it is attached to.
    * Takes an optional constructor function as an argument.
        * If no argument is given, then the parent constructor will be inherited. See the examples section if you're not sure what that means.
        * Useful when you just want to create a child with overridden methods.
    * Copies `extend`, `implement`, and `neo` static methods to the new child class.
    * Returns `constructor`, or if the constructor argument is omitted, it returns a new _inherited_ constructor.
* `implement( [ Object, ... ] )`
    * Add properties to the prototype of the constructor it is attached to.
    * _All_ non-null/non-undefined properties on _all_ objects passed to implement will be added to the class constructor prototype.
    * Takes 0 or more objects as arguments.
        * Passing no objects is silly, but allowed.
    * Returns the constructor it's attached to.
* `neo( ... )`
    * A static shortcut for `new`.
    * `Class.neo( ... )` is equivalent to `new Class( ... )`.
    * Prettier when you want to immediately chain methods on a new instance or if you're using instantiation for side effects.
    * _Does_ introduce a teeeeensy bit of overhead. I mean really teensy. Statistically insignificant.
    * Returns a new instance of the constructor it's attached to.

StdClass also has the following static methods which it _does not_ pass along to the constructors that it creates/modifies.

* `StdClass.mixin( Function constructor )`
    * Takes a required constructor function argument.
    * Attaches the `extend`, `implement`, and `neo` static methods to constructors that were not created by StdClass.
    * Useful for adding StdClass tools to classes that cannot directly inherit from StdClass.
    * Returns the constructor.
* `StdClass.cleanup( Function constructor )`
    * Removes `extend`, `implement`, and `neo` from the constructor.
    * Will _only_ remove these properties if the are strictly equal to the original methods on StdClass.
    * This is just here for completeness sake. No overhead should be added by leaving the tools in place.
    * This does _not_ affect the prototype, so any derivatives that have already been created will also be un-affected.
    * Returns the constructor.

_All_ of the above methods are completely portable. You can attach any of them to any function and they will just work.

A reference to the parent class prototype is also statically attached to child constructors for convenience.

* `parent`
    * `Child.parent === Parent.prototype`

This quite literally (in the literal sense) does not add any extra overhead. Not even in the `extend` method.

Having a reference to the parent prototype on the child constructor, allows parent methods to be referenced without referring to the parent by name. That's a good thing if your parent class changes or is renamed, because you won't have to refactor your child classes. You can of course still use the parent class name if you prefer.

The `parent` property also allows for a universally accessible inheritance chain like this.

    constructor.parent.constructor.parent.constructor.parent ...

See the "Notes" section about why that's noteworthy.

Examples
--------

Parent Class

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

Child Class

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

No explicit constructor means inherit the parent constructor.

_Inheriting a constructor means automatically creating a constructor function that does nothing except call the parent constructor, passing through all arguments._

    var InheritedConstructor = MyChild.extend();

    // Which is the same as...
    var Equivalent = MyChild.extend( function()
    {
        return Equivalent.parent.constructor.apply( this, arguments );
    });

Implement can be passed multiple arguments.

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

StdClass helper methods can be mixed-in to any class.

    var DumbClass = function()
    {
        // Assume this is somebody elses class that you've included in your
        // project. It doesn't have any built in way of extending it! You'll
        // have to do it the old fashioned way... or will you?
    };

    StdClass.mixin( DumbClass );

    // Woot!
    var Extended = DumbClass.extend();

Turn it back into a dumb class.

    StdClass.cleanup( DumbClass );

    DumbClass.hasOwnProperty( 'extend' ); // false
    DumbClass.hasOwnProperty( 'implement' ); // false
    DumbClass.hasOwnProperty( 'neo' ); // false

    // Awww, it's dumb again.

How about making it just a little smart? Remember, the StdClass static methods are portable. You can attach them to any constructor and they work.

    DumbClass.extend = StdClass.extend;
    
    // Well isn't he just a chip off the ol' block.
    var SonOfDumbClass = DumbClass.extend();

Notes
-----

### Library, Not Framework

The hallmark of a framework is Inversion of Control. It _looks_ like there's some IoC going on because of the StdClass base class, and what seems like a factory pattern in the `neo` method. But it only seems that way at first glance.

Inheriting from StdClass is completely optional and is simply an alternative to the `StdClass.mixin` method. StdClass is not a template or abstract class, and therefore does not use any dependency injection. In fact, it does not have any instance methods at all.

The `neo` method also does not really create a factory pattern since the instance it returns is of the class it's statically attached to. There's nothing abstract about it, and therefore it's not a factory pattern.

Just in case library status is still in doubt, `StdClass.mixin` and `StdClass.cleanup` are provided so that the utility methods can be added and removed from existing classes without side effects. This makes it sort of a persistant toolkit if anything ;).

I'm not against frameworks, but IoC flow can be a little hard to follow (and maintain) due to JavaScript's extremely flexible runtime object oriented features. Therefore, I prefer to constrain my use of the IoC pattern to my application logic (usually an MV* framework), rather than have layers of frameworks as dependencies.

### Prototype Chain

The `extend` method adds a `parent` property to child constructors which is a reference to the parent's prototype object. Useful when calling parent methods, but there's another useful side effect.

You would think since there _is_ a prototype chain, traversing it to get parent class prototypes and constructors would already be possible in all JavaScript environments. You would be wrong if you thought so and you will probably end up going in loops if you try to walk that chain.

Given a class `Class`, the following approaches _will not work!_

    Class.prototype.constructor.prototype; // loop
    Class.prototype.prototype; // undefined - Only functions have prototypes.
    Class.constructor; // You just found the function constructor, Function.

As you might guess given the above, your chances don't get any better with an instance.

    var instance = new Class();
    instance.constructor; // You just got back to Class. See above.
    instance.prototype; // undefined - Only functions have prototypes.

Some environments _do_ expose the _real_ prototype chain in a property named `__proto__` or similar, but this is not a universal feature.

I debated with myself long and hard (that's what she said) about whether to have `extend` add the `parent` property. On the one hand, it's _sort of_ adding a feature to the language that would not normally exist. That's something I wanted to avoid like adding `_super` methods or multiple inheritance. On the other hand, it's a property containing a reference. No functions required, no overhead incurred, no relying on emergent behavior not explicitly stated in the language specification.

I decided to add it because it requires no maintanence. Once it's set, it doesn't need to be updated on class instantiation, when a member function is called, and if you extend the class without using `extend`, it will simply not exist on the child constructor rather than existing incorrectly.

### Multiple Inheritance

JavaScript does not support it. Mixins are not it. It's a prototype chain, not a prototype tree or graph.

If someone tells you that JavaScript supports it, here is why they are wrong:

`C` instanceof `A` __and__ `C` instanceof `B`

__therefore__

`A` instanceof `B` __or__ `B` instanceof `A`

If someone still insists that multiple inheritance is possible and that the above is just an `instanceof` operator limitation, then have them setup a scenario where a change to `A.prototype` _cannot_ affect `B.prototype`, and a change to `B.prototype` _cannot_ affect `A.prototype`, but a modification to either _can_ affect `C.prototype`.

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

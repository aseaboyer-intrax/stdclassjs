StdClassJS
==========

A dead simple base class providing two self propagating static methods, extend and mixin.

Including
---------

### Node

    var StdClass = require( 'stdclass' );

### Browser

    <script src="/path/to/stdclass.js"></script>

Usage
-----

    var MyClass = StdClass.extend( function( args, go, here )
    {
        // Do constructor stuff.
    })
    .mixin({
        instanceMethod: function( and, here )
        {
            // Do method stuff.
        }
    });
    
    var MyBetterClass = MyClass.extend( function( args, go, here, too )
    {
        // Call the parent constructor.
        MyClass.call( this, args, go, here );
        
        // Do better constructor stuff.
        this.too = too;
    })
    .mixin({
        instanceMethod: function( and, here, too )
        {
            // Call the parent method.
            MyClass.prototype.instanceMethod.call( this, and, here );
            
            // Do better method stuff.
            this.too = too;
        },
        newMethod: function()
        {
            // Do new method stuff.
        }
    });
    

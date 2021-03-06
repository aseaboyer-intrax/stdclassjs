#!/usr/bin/env node

"use strict";

var StdClass = require( './stdclass.js' );

exports.mixin = function( test )
{
	test.expect( 5 );

	var MyClass = function() {};

	test.ok( StdClass.mixin( MyClass ) === MyClass, "constructor not returned" );
	test.ok( MyClass.extend === StdClass.extend, "extend not copied"  );
	test.ok( MyClass.implement === StdClass.implement, "implement not copied" );
	test.ok( MyClass.neo === StdClass.neo, "neo not copied" );
	test.ok( MyClass.mixin !== StdClass.mixin, "mixin copied" );

	test.done();
};

exports.cleanup = function( test )
{
	test.expect( 4 );

	var MyClass = StdClass.extend();

	test.ok( StdClass.cleanup( MyClass ) === MyClass, "constructor not returned" );
	test.ok( !MyClass.hasOwnProperty( 'extend' ), "extend not deleted"  );
	test.ok( !MyClass.hasOwnProperty( 'implement' ), "implement not deleted" );
	test.ok( !MyClass.hasOwnProperty( 'neo' ), "neo not deleted" );

	test.done();
};

exports.extend = function( test )
{
	test.expect( 4 );

	var ctor = function() {};
	var MyClass = StdClass.extend( ctor );

	test.ok( MyClass === ctor, "constructor not returned" );
	test.ok( MyClass.prototype.constructor === ctor, "prototype.constructor not set" );
	test.ok( MyClass.extend === StdClass.extend, "extend was not propagated" );
	test.ok( MyClass.implement === StdClass.implement, "implement was not propagated" );

	test.done();
};

exports.create_instance = function( test )
{
	test.expect( 2 );

	var MyClass = StdClass.extend( function()
	{
		this.success = true;
	});

	var instance = new MyClass();

	test.ok( instance instanceof StdClass, "not a StdClass instance" );
	test.ok( instance.success === true, "constructor not called" );

	test.done();
};

exports.inherit_constructor = function( test )
{
	test.expect( 1 );

	var MyClass = StdClass.extend( function()
	{
		this.success = true;
	});

	var MySecondClass = MyClass.extend();

	var instance = new MySecondClass();
	test.ok( instance.success === true, "parent constructor was not inherited" );

	test.done();
};

exports.implement = function( test )
{
	test.expect( 7 );

	var MyClass = StdClass.extend();

	test.ok(
		MyClass.implement({
			foo: function()
			{
				return 'foo';
			},
			bar: function()
			{
				return 'bar';
			}
		}) === MyClass
		, "constructor not returned"
	);

	var instance = new MyClass();

	test.ok( MyClass.prototype.hasOwnProperty( 'foo' ), "property missing" );
	test.ok( MyClass.prototype.hasOwnProperty( 'bar' ), "property missing" );
	test.ok( MyClass.prototype.foo instanceof Function, "expected function" );
	test.ok( MyClass.prototype.bar instanceof Function, "expected function" );
	test.ok( instance.foo() === 'foo', "wrong method called" );
	test.ok( instance.bar() === 'bar', "wrong method called" );

	test.done();
};

exports.implement_multiples = function( test )
{
	var undef;

	var MyClass = StdClass.extend().implement(
		{
			foo: 'a',
			keep1: 'b',
			keep2: 'c',
			keep3: 'd'
		},
		{
			foo: 'e',
			bar: 'f',
			keep1: undef
		},
		{
			bar: 'g',
			keep2: null
		}
	);

	test.ok( MyClass.prototype.foo === 'e' );
	test.ok( MyClass.prototype.bar === 'g' );
	test.ok( MyClass.prototype.keep1 === 'b' );
	test.ok( MyClass.prototype.keep2 === 'c' );
	test.ok( MyClass.prototype.keep3 === 'd' );

	test.done();
};

exports.second_generation = function( test )
{
	test.expect( 8 );

	var MyClass = StdClass.extend( function()
	{
		this.MyClass_success = true;
	})
	.implement({
		foo: function()
		{
			return 'foo';
		}
	});

	var MySecondClass = MyClass.extend( function()
	{
		MyClass.call( this );

		this.MySecondClass_success = true;
	})
	.implement({
		foo: function()
		{
			return MyClass.prototype.foo.call() + '2';
		},
		bar: function()
		{
			return 'bar';
		}
	});

	var instance1 = new MyClass(),
		instance2 = new MySecondClass();

	test.ok( instance1 instanceof MyClass, "parent class not instance of parent class" );
	test.ok( !( instance1 instanceof MySecondClass ), "parent class is instanceof child class" );
	test.ok( instance1.foo() === 'foo', "wrong method called" );
	test.throws( function()
	{
		instance1.bar();
	});

	test.ok( instance2 instanceof MyClass, "child class not instance of parent class" );
	test.ok( instance2 instanceof MySecondClass, "child class not instance of child class" );
	test.ok( instance2.foo() === 'foo2', "super method not called" );
	test.ok( instance2.bar() === 'bar', "wrong method called" );

	test.done();
};

exports.late_prototype_modification = function( test )
{
	test.expect( 7 );

	var MyClass = StdClass.extend( function() {} ),
		MySecondClass = MyClass.extend( function() {} ),
		instance1 = new MyClass(),
		instance2 = new MySecondClass();

	MyClass.prototype.foo = function()
	{
		return 'foo';
	};

	MySecondClass.prototype.bar = function()
	{
		return 'bar';
	};

	test.doesNotThrow( function()
	{
		test.ok( instance1.foo() === 'foo', "wrong method called" );
	}, Error, "late prototype modification of parent had no effect" );

	test.throws( function()
	{
		instance1.bar();
	}, Error, "child prototype change affected parent" );

	test.doesNotThrow( function()
	{
		test.ok( instance2.foo() === 'foo', "wrong method called" );
	}, Error, "parent prototype change did not affect child" );

	test.doesNotThrow( function()
	{
		test.ok( instance2.bar() === 'bar', "wrong method called" );
	}, Error, "late prototype modification of child had no effect" );

	test.done();
};

exports.mixin_extend = function( test )
{
	var MyClass = function() {};
	StdClass.mixin( MyClass );

	var MyChildClass = MyClass.extend(),
		instance = new MyChildClass();

	test.ok( instance instanceof MyClass, "child class not an instance of parent" );
	test.ok( !( instance instanceof StdClass ), "mixin should not make child class an instance of StdClass" );

	test.done();
};

exports.parent = function( test )
{
	test.expect( 5 );

	var MyClass = StdClass.extend( function()
	{
		this.MyClass_success = true;
	})
	.implement({
		foo: function( test )
		{
			return test.toUpperCase();
		}
	});

	var MyChildClass = MyClass.extend( function()
	{
		MyChildClass.parent.constructor.call( this );
		this.MyChildClass_success = true;
	})
	.implement({
		foo: function( test )
		{
			return MyChildClass.parent.foo.call( this, test ) + test;
		}
	});

	test.ok( MyChildClass.hasOwnProperty( 'parent' ), 'parent property missing' );
	test.ok( MyChildClass.parent === MyClass.prototype, 'parent property invalid' );

	test.doesNotThrow( function()
	{
		var instance = new MyChildClass();
		test.ok( instance.MyClass_success === true && instance.MyChildClass_success === true, "parent constructor not run correctly" );
		test.ok( instance.foo( 'bar' ) === 'BARbar', "super method return mangled" );
	});

	test.done();
};

exports.neo = function( test )
{
	test.expect( 3 );

	var MyClass = StdClass.extend();

	test.doesNotThrow( function()
	{
		var instance = MyClass.neo();
		test.ok( instance instanceof MyClass );
		test.ok( instance instanceof StdClass );
	});

	test.done();
};

var reporter = require( 'nodeunit' ).reporters.default;
reporter.run(['test.js']);

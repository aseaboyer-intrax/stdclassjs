#!/usr/bin/env node

"use strict";

var reporter = require( 'nodeunit' ).reporters.default;
reporter.run(['unit/basic']);

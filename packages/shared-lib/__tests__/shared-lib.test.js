'use strict';

const sharedLib = require('..');
const assert = require('assert').strict;

assert.strictEqual(sharedLib(), 'Hello from sharedLib');
console.info('sharedLib tests passed');

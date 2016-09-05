#!/usr/bin/env node

'use strict';

const nconf  = require('nconf');
const fs     = require('fs');
const path   = require('path');
const Chain  = require('middleware-chain');
const output = require('./views/formatter');
const dir    = path.join(__dirname, 'middleware');

/**
 * Instantiating a new chain.
 */
const chain = new Chain();

/**
 * Initializing `nconf` to load its configuration
 * based on the command line arguments, and the
 * configuration file.
 */
nconf.argv().file('./config.json');

/**
 * Injecting core middleware.
 */
chain.use(require('./middleware/core/cmd-line'));
chain.use(require('./middleware/core/inquirer'));

/**
 * Injecting application-level middleware located
 * in the `middleware` directory.
 */
fs.readdirSync(dir).forEach((file) => {
    const name = path.join(dir, file);
    if (fs.lstatSync(name).isFile()) {
        chain.use(require(name));
    }
});

/**
 * Middleware called when the command was
 * not resolved.
 */
chain.use(() => {
    output.warn('The given command could not be resolved by any module');
});

/**
 * Middleware called when an error was thrown
 * by a middleware.
 */
chain.use((err, input, output, next) => {
    output.error(`An error was thrown by a module : ${err}`);
});

/**
 * Triggering the middleware chain.
 */
chain.handle(nconf, output);

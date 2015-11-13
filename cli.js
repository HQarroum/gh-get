#!/usr/bin/env node

'use strict';

let nconf = require('nconf');
let fs    = require('fs');
let path  = require('path');
let chalk = require('chalk');
let Chain = require('middleware-chain');
let dir   = path.join(__dirname, 'middleware');

/**
 * Instantiating a new chain.
 */
let chain = new Chain();

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
    let name = path.join(dir, file);
    if (fs.lstatSync(name).isFile()) {
        chain.use(require(name));
    }
});

/**
 * Middleware called when the command was
 * not resolved.
 */
chain.use(() => {
    console.warn(chalk.red.bold('[!] The given command could not be resolved by any module'));
});

/**
 * Middleware called when an error was thrown
 * by a middleware.
 */
chain.use((err, input, output, next) => {
    console.error(chalk.red.bold('[!] An error was thrown by a module :', err));
});

/**
 * Triggering the middleware chain.
 */
chain.handle(nconf, {});

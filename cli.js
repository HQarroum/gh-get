#!/usr/bin/env node

var nconf = require('nconf');
var fs    = require('fs');
var path  = require('path');
var chalk = require('chalk');
var Chain = require('middleware-chain');
var dir   = path.join(__dirname, 'middleware');

/**
 * Instantiating a new chain.
 */
var chain = new Chain();

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
chain.use(require('./middleware/core/octocat-ascii'));
chain.use(require('./middleware/core/inquirer'));

/**
 * Injecting application-level middleware located
 * in the `middleware` directory.
 */
fs.readdirSync(dir).forEach(function (file) {
    var name = path.join(dir, file);
    if (fs.lstatSync(name).isFile()) {
        chain.use(require(name));
    }
});

/**
 * Middleware called when the command was
 * not resolved.
 */
chain.use(function () {
    console.warn(chalk.red.bold('[!] The given command could not be resolved by any module'));
});

/**
 * Middleware called when an error was thrown
 * by a middleware.
 */
chain.use(function (err, input, output, next) {
    console.error(chalk.red.bold('[!] An error was thrown by a module :', err));
});

/**
 * Triggering the middleware chain.
 */
chain.handle(nconf, {});

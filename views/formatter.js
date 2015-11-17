'use strict';

let chalk     = require('chalk');
let titleize  = require('titleize');
let formatter = module.exports = console;

formatter.chalk = chalk;

/**
 * Internal helper used to format an entry.
 * @param entry the entry to output
 * @param color a function used to colorize
 * the output
 * @param def the default value
 * @private
 */
formatter.entry_ = (entry, color, def) => `${chalk.bold.blue(' *')} ${color(entry || def)}`;

/**
 * Displays an entry line.
 * @param entry the entry to display
 * @param def the default value
 */
formatter.entry = (entry, def) => formatter.entry_(entry, chalk.bold.blue, def);

/**
 * Displays an informational entry.
 * @param entry the entry to display
 * @param def the default value
 */
formatter.info = (entry, def) => formatter.entry_(entry, chalk.bold.white, def);

/**
 * Displays a title.
 * @param title the title to display
 * @param def the default value
 */
formatter.title = (title, def) => formatter.entry_(title, chalk.underline.bold.yellow, def);

/**
 * Displays a description.
 * @param desc
 * @param def the default value
 */
formatter.description = (desc, def) => formatter.entry_(desc, chalk.bold.green, def);

/**
 * Displays a key/value pair association.
 */
formatter.pair = (key, value) => `${chalk.bold(titleize(key))}: ${value||'(Not defined)'}`;

/**
 * Renders a template.
 */
formatter.render = function () {
    console.log(require('./' + arguments[0])(formatter, ...Array.prototype.slice.call(arguments, 1)));
};
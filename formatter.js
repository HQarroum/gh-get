'use strict';

let chalk     = require('chalk');
var titleize  = require('titleize');
let formatter = module.exports = console;

formatter.entry_ = (entry, color, def) => {
    (entry || def) && console.log(
      chalk.bold.blue(' *'),
      color(entry || def)
    );
};

/**
 * Displays an entry line.
 * @param entry the entry to display
 */
formatter.entry = (entry, def) => {
    formatter.entry_(entry, chalk.bold.blue, def);
};

/**
 * Displays a title.
 * @param title the title to display
 */
formatter.title = (title, def) => {
    formatter.entry_(title, chalk.underline.bold.yellow, def);
};

/**
 * Displays a description.
 * @param desc
 * @param def
 */
formatter.description = (desc, def) => {
    formatter.entry_(desc, chalk.bold.green, def);
};

/**
 * Displays a key/value pair association.
 */
formatter.pair = (key, value) => {
    if (key && value) {
        console.log(
          chalk.bold(titleize(key)) + ':', value
        );
    }
};

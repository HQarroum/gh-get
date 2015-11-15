'use strict';

let chalk     = require('chalk');
let titleize  = require('titleize');
let formatter = module.exports = console;

/**
 * Displays an entry.
 * @param entry the entry to display
 * @param color the function to call to apply a transformation
 * on the entry
 * @param def the default value used in case the entry has
 * an undefined value
 */
formatter.entry_ = (entry, color, def) => {
    (entry || def) && console.log(
      chalk.bold.blue(' *'),
      color(entry || def)
    );
};

/**
 * Displays an entry line.
 * @param entry the entry to display
 * @param def the default value used in case the entry has
 * an undefined value
 */
formatter.entry = (entry, def) => {
    formatter.entry_(entry, chalk.white, def);
};

/**
 * Displays an information.
 * @param info the information to display
 * @param def the default value used in case the information has
 * an undefined value
 */
formatter.info = (info, def) => {
    formatter.entry_(info, chalk.bold.blue, def);
};

/**
 * Displays a title.
 * @param title the title to display
 * @param def the default value used in case the entry has
 * an undefined value
 */
formatter.title = (title, def) => {
    formatter.entry_(title, chalk.underline.bold.yellow, def);
};

/**
 * Displays a description.
 * @param desc the description string
 * @param def the default value used in case the entry has
 * an undefined value
 */
formatter.description = (desc, def) => {
    formatter.entry_(desc, chalk.bold.green, def);
};

/**
 * Displays a key/value pair association.
 * @param def the key to display
 * @param def the value to display
 */
formatter.pair = (key, value) => {
    if (key && value) {
        console.log(
          chalk.bold(titleize(key)) + ':', value
        );
    }
};

'use strict';

let _        = require('lodash');
let chalk    = require('chalk');
let inquirer = require('inquirer');

/**
 * Displays the information associated with a
 * Gist.
 * @returns the formatted Gist information
 */
var information = (formatter, gist) => {
    formatter.log(`${formatter.title(`Gist ${gist.id} (${_.keys(gist.files).length} files(s)`)})
        \r${formatter.entry(gist.html_url)}
        \r${formatter.entry(gist.description ? gist.description : "(None)")}
    `);
};

var sanitize = (gist) => (gist ? new String(gist.description).trim().replace(/\r?\n/g, ' ') : '(Empty description)');

/**
 * Prompts the user to choose between the different Gists available.
 * @param gists the list of public Gists owned
 * by the current user.
 * @returns {Promise} a promise to the chosen Gist.
 */
var gist = (formatter, input, gists) => new Promise((resolve) => {
    const path = input.get('answers:path');

    if (path) return resolve(path);
    inquirer.prompt([{
        message: 'Which Gist are you interested in ?',
        type: 'list',
        name: 'path',
        choices: _.map(gists, sanitize)
    }], (answers) => {
        resolve(input.set('answers:path', _.findWhere(gists, { description: answers.path }).id));
    });
});

/**
 * Prompts the user to choose between the different files available
 * in the selected Gist.
 * @param files the list of files part of the Gist.
 * @returns {Promise} a promise to the chosen file.
 */
var files = (formatter, files) => new Promise((resolve) => {
    inquirer.prompt([
        {
            message: 'Which file are you interested in ?',
            type: 'checkbox',
            name: 'name',
            choices: _.keys(files)
        }
    ], (answers) => {
        _.each(answers.name, (name) => {
            formatter.log();
            formatter.log(chalk.bold(chalk.blue('* '), chalk.magenta(name)), '\n');
            formatter.log(files[name].content);
            formatter.log();
        });
        resolve();
    });
});

module.exports = {
    prompt: { gist, files },
    render: { information }
};

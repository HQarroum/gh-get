'use strict';

var chalk    = require('chalk');
var inquirer = require('inquirer');
var _        = require('lodash');
var gist     = require('../controllers/gists');

/**
 * Displays information about a Gist.
 */
var entry = function (gist) {
    console.log(
        chalk.bold.blue(' *'),
        chalk.bold.underline.magenta('Gist', gist.id),
        chalk.bold.blue('(' + _.keys(gist.files).length, 'file(s))')
    );
    console.log(chalk.bold.blue(' *', gist.html_url));
    console.log(
      chalk.bold.blue(' *'),
      chalk.bold.green(gist.description ? gist.description : "(None)"),
      '\n'
    );
};

var sanitized = (gists) =>_.map(gists, function (gist) {
    var output = new String(gist.description).trim()
      .replace(/\r?\n/g, ' ');

    if (!output.length) {
        return '(Empty description)';
    }
    return output;
});

/**
 * Prompts the user to choose between the different Gists available.
 * @param gists the list of public Gists owned
 * by the current user.
 * @returns {Promise} a promise to the chosen Gist.
 */
var promptGist = (gists) => new Promise(function (resolve) {
    inquirer.prompt([
        {
            message: 'Which Gist are you interested in ?',
            type: 'list',
            name: 'path',
            choices: sanitized(gists)
        }
    ], function (answers) {
        resolve(_.findWhere(gists, { description: answers.path }).id);
    });
});

/**
 * Prompts the user to choose between the different files available
 * in the selected Gist.
 * @param files the list of files part of the Gist.
 * @returns {Promise} a promise to the chosen file.
 */
var promptFiles = (files) => new Promise(function (resolve) {
    inquirer.prompt([
        {
            message: 'Which file are you interested in ?',
            type: 'checkbox',
            name: 'name',
            choices: _.keys(files)
        }
    ], (answers) => {
        _.each(answers.name, function (name) {
            console.log();
            console.log(chalk.bold(chalk.blue('* '), chalk.magenta(name)), '\n');
            console.log(files[name].content);
            console.log();
        });
        resolve();
    });
});

/**
 * Displays up to 100 Gists of the given user.
 * @param input the chain input
 * @param next the next middleware trigger
 */
var displayGists = (input, next) => {
    const username = input.get('answers:username');

    gist.list(input).then(function (response) {
        if (response.body.length > 0) {
            console.log('Here is a list of', chalk.underline(username) + '\'s Gists :\n');
            response.body.forEach(function (follower) {
                entry(follower);
            });
        } else {
            console.log('This user does not have any public Gist');
        }
    }).catch(next);
};

/**
 * Displays information about the Gist of the given user.
 * @param input the chain input
 * @param next the next middleware trigger
 */
var displayGist = (input, next) => {
    const name = input.get('answers:path');

    if (name) {
        gist.get(input).then(function (response) {
            entry(response.body);
            return promptFiles(response.body.files);
        }).catch(next);
    } else {
        gist.list(input).then(function (response) {
            return promptGist(response.body);
        }).then(function (id) {
            input.set('answers:path', id);
            return gist.get(input);
        }).then(function (response) {
            entry(response.body);
            return promptFiles(response.body.files);
        }).catch(next);
    }
};

/**
 * The `gists` middleware entry point.
 * @param input the input data store.
 * @param output the middleware output
 * @param next the callback to the next middleware
 */
module.exports = (input, output, next) => {
    const action = input.get('answers:action');

    if (action === 'List the Gists of a user') {
        displayGists(input, next);
    } else if (action === 'Retrieve the Gist of a user') {
        displayGist(input, next);
    } else {
        next();
    }
};
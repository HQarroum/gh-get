'use strict';

var _        = require('lodash');
var inquirer = require('inquirer');
var chalk    = require('chalk');
var path     = require('path');
var fs       = require('fs');

/**
 * A map between the inquirer display strings and their equivalent
 * name used by middlewares along the chain.
 */
var map = {
    'Consult the profile page of a user': 'profile',
    'List the repositories of a user': 'repositories',
    'List the followers a user has': 'followers',
    'List the people followed by a user': 'followings',
    'List the people followed by a user but not following him': 'unfollowers',
    'List the Gists of a user': 'gists',
    'Retrieve the Gist of a user': 'gist',
    'Search for repositories, users or code': 'search',
    'Get some help': 'help',
    'Quit': 'quit'
};

/**
 * Displays the octocat logo.
 */
var octocat = (output) => {
    var name = path.join(__dirname, '..', '..', 'assets', 'octocat.txt');
    output.log(chalk.yellow(
      fs.readFileSync(name, 'utf8')
    ));
};

/**
 * Prompts the user to choose an action.
 * @returns {Promise} a promise to the user action.
 */
var promptAction = (input) => new Promise((resolve) => {
    inquirer.prompt([{
        message: 'What would you like to do ?',
        type: 'list',
        name: 'action',
        choices: [
            'Consult the profile page of a user',
            'List the followers a user has',
            'List the people followed by a user',
            'List the people followed by a user but not following him',
            'List the repositories of a user',
            'List the Gists of a user',
            'Search for repositories, users or code',
            'Quit'
        ]
    }], (answers) => resolve(map[answers.action]));
});

/**
 * This middleware prompts the user to choose between
 * different actions.
 * @param input the input storage
 * @param output the output object
 * @param next a callback to call the next middleware
 */
module.exports = (input, output, next) => {
    const action = input.get('answers:action');

    if (!action) {
        octocat(output);
        return promptAction(input).then((action) => {
            input.set('answers:action', action);
            next();
        });
    }
    next();
};
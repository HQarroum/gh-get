var inquirer = require('inquirer');
var chalk    = require('chalk');
var _        = require('lodash');

/**
 * A predicate function used as a string validator for
 * inquirer.
 * @param message the message to display on a validation
 * failure.
 * @returns {Function} a validator.
 */
var validator = function (message) {
    return function (value) {
        return (value && value.length > 0) || message;
    };
};

/**
 * Prompts the user to enter the username he is
 * interested in.
 * @returns {Promise} a promise to the given username.
 */
var promptUsername = function () {
    return new Promise(function (resolve) {
        inquirer.prompt([{
            message: 'Which user are you interested in ? (e.g HQarroum)',
            name: 'username',
            validate: validator('Please enter a user name')
        }], resolve);
    });
};

/**
 * Prompts the user to choose an action.
 * @returns {Promise} a promise to the user action.
 */
var promptAction = function () {
    return new Promise(function (resolve) {
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
                'Retrieve the Gist of a user',
                'Quit'
            ]
        }], resolve);
    });
};

/**
 * Asks the user what action he would like to perform.
 * @returns {Promise} a promise to the user response
 */
var prompt = function () {
    return promptAction().then(function (answers) {
        if (answers.action !== 'Quit' && !answers.username) {
            return promptUsername().then(function (username) {
                return _.assign(answers, username);
            });
        }
        return answers;
    });
};

/**
 * This middleware prompts the user to choose between
 * different actions.
 * @param input the input storage
 * @param output the output object
 * @param next a callback to call the next middleware
 */
module.exports = function (input, output, next) {
    var answers = input.get('answers');

    if (_.isObject(answers)) {
        // Another middleware already filled in
        // the user answers.
        return next();
    }
    prompt().then(function (answers) {
        if (answers.action === 'Quit') {
            console.log(chalk.yellow('Goodbye !'));
            return process.exit(0);
        }
        input.set('answers', answers);
        next();
    }).catch(next);
};
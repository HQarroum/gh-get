'use strict';

var _     = require('lodash');
var chalk = require('chalk');

var map = {
    'profile': 'Consult the profile page of a user',
    'repositories': 'List the repositories of a user',
    'followers': 'List the followers a user has',
    'followings': 'List the people followed by a user',
    'unfollowers': 'List the people followed by a user but not following him',
    'gists': 'List the Gists of a user',
    'gist': 'Retrieve the Gist of a user'
};

var parseInput = (argument) => {
    var array = argument.split(':');
    var answers = {};

    if (!map[array[0]]) {
        console.warn(chalk.red.bold('[!] The given command could not be resolved by any module'));
        return process.exit(0);
    }
    answers.action = map[array[0]];
    if (array[1]) {
        var token = array[1].split('/');
        answers.username = token[0];
        if (token[1]) {
            answers.path = _.reduce(token.splice(1), function (total, path) {
                return total + '/' + path;
            });
        }
    }
    return answers;
};

var resolveInput = function (input) {
    var store = input.stores.argv.store._;

    if (!store || !store.length) {
        return null;
    }
    return parseInput(store[0]);
};

module.exports = (input, output, next) => {
    const answers = input.get('answers');
    const action  = resolveInput(input);

    if (answers && answers.action && answers.username) {
        // Another middleware already filled in
        // the user answers.
        return next();
    }
    if (action) {
        input.set('answers', action);
    }
    next();
};
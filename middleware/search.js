'use strict';

var inquirer = require('inquirer');
var search   = require('../controllers/search');

var searchToken = (output) => (token) => search(token).then((results) => promptResults);

var promptResults = (resuts) => {
    
};

var promptToken = (input, output) => {
    inquirer.prompt([
        {
            message: 'Enter the token you are looking for',
            name: 'path'
        }
    ], (answers) => {
        resolve(_.assign(input, { path: answers.path }));
    });
};

var search = (input, output) => {
    const token = input.get('answers:path');

    if (!token) {
        return promptToken(input, output).then(searchToken(output));
    }
    return searchToken(output)(token);
};

module.exports = (input, output, next) => {
    const action = input.get('answers:actions');

    if (action === 'Search for a repository or a user') {
        search(input, output).catch(next);
    }
    next();
};
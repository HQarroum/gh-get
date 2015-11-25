'use strict';

const _        = require('lodash');
const inquirer = require('inquirer');

var sanitize = (gist) => (gist ? new String(gist.description).trim().replace(/\r?\n/g, ' ') : '(Empty description)');

/**
 * Displays the information associated with a
 * Gist.
 */
var information = (formatter, gist) => {
    formatter.log(`${formatter.title(`Gist ${gist.id} (${_.keys(gist.files).length} files(s)`)})
        \r${formatter.entry(gist.html_url)}
        \r${formatter.entry(gist.description ? gist.description : "(None)")}
    `);
};

/**
 * Displays the content of a file.
 * @param formatter the output formatter
 * @param file the file to display the
 * content from
 */
var renderFile = (formatter, file) => {
    formatter.log(`
        \r${formatter.title(`${file.filename} (${file.language||'Unknown language'})`)}\n
        \r${file.content}`);
};

/**
 * Displays the content of a file list.
 * @param formatter the output formatter
 * @param files the file list to display
 * the content from
 */
var renderFiles = (formatter, files) => {
    _.each(files, (file) => renderFile(formatter, file));
};

/**
 * Prompts the user to choose between the different Gists available.
 * @param gists the list of public Gists owned
 * by the current user.
 * @param formatter the output formatter
 * @returns {Promise} a promise to the chosen Gist.
 */
var list = (formatter, input, gists) => new Promise((resolve) => {
    const path = input.get('answers:path');

    if (path) return resolve(path);
    inquirer.prompt([{
        message: 'Which Gist are you interested in ?',
        type: 'list',
        name: 'path',
        choices: _.map(gists, sanitize)
    }], (answers) => {
        const gist = _.findWhere(gists, { description: answers.path });
        input.set('answers:path', gist);
        resolve(gist);
    });
});

/**
 * Prompts the user to choose between the different files available
 * in the selected Gist.
 * @param formatter the output formatter
 * @param files the list of files part of the Gist.
 * @returns {Promise} a promise to the chosen file.
 */
var promptFiles = (formatter, files) => new Promise((resolve) => {
    inquirer.prompt([{
        message: 'Which file are you interested in ?',
        type: 'checkbox',
        name: 'name',
        choices: _.keys(files)
    }], (answers) => {
        resolve(_.pick(files, answers.name));
    });
});

module.exports = {
    prompt: { list, files: promptFiles },
    render: { information, files: renderFiles }
};

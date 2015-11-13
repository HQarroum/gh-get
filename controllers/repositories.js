var got   = require('gh-got');
var repos = module.exports;

/**
 * Returns a promise to the list of up to 100 public
 * repositories of the given user.
 */
repos.list = function (input) {
    return got('users/' + input.get('answers:username') + '/repos?per_page=100', input.headers);
};
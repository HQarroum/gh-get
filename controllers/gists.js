var got  = require('gh-got');
var gist = module.exports;

/**
 * Returns a promise to the list of up to 100 public
 * Gists of the given user.
 */
gist.list = function (input) {
    return got('users/' + input.get('answers:username') + '/gists?per_page=100', input.headers);
};

/**
 * Returns a promise to the list of up to 100 public
 * Gists of the given user.
 */
gist.get = function (input) {
    return got('gists/' + input.get('answers:path'), input.headers);
};
'use strict';

let _        = require('lodash');
let search   = require('../controllers/search');
let profile  = require('../controllers/profile');

var handler = {
    'users': function (r, input, output) {
        return output.prompt('search/users', r.body.items)
            .then((name) => profile.get(name, input))
            .then((o) => output.render('users/profile', o.body));
    },
    'repositories': function (response) {

    },
    'code': function (response) {

    }
};

/**
 * Dispatches the search type to
 * @param input
 * @param output
 */
var startSearch = (input, output, next) => {
    const type = input.get('answers:identifier');

    if (type) {
        return output.prompt('search/token', input)
            .then(() => search[type](input))
            .then((r) => handler[type](r, input, output));
    }
    return next(new Error(`Unknown search type: ${type}`));
};

module.exports = (input, output, next) => {
    const action = input.get('answers:action');

    if (action === 'search') {
        return output.prompt('search/type', input)
          .then(() => startSearch(input, output, next))
          .catch(next);
    }
    next();
};

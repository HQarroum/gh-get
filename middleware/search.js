'use strict';

let _        = require('lodash');
let search   = require('../controllers/search');

var display = (out, r) => {
    console.log(r.body.items);
};

/**
 * Dispatches the search type to
 * @param input
 * @param output
 */
var startSearch = (input, output, next) => {
    const type = input.get('answers:identifier');

    if (type) {
        return output.prompt('search').token(input)
          .then(() => search[type](input))
          .then(output.prompt('search').users);
    }
    return next(new Error(`Unknown search type: ${type}`));
};

module.exports = (input, output, next) => {
    const action = input.get('answers:action');

    if (action === 'search') {
        return output.prompt('search').type(input)
          .then(() => startSearch(input, output, next))
          .catch(next);
    }
    next();
};

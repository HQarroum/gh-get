'use strict';

var _ = require('lodash');

/**
 * Parses the given input and extracts the provided parameters.
 * @param input the middleware input chain
 * @returns a parameters object
 */
var resolveParams = (input) => {
    const argument = input.stores.argv.store._ && input.stores.argv.store._[0];

    if (argument) {
        const groups = /([a-zA-Z]+)(:([a-zA-Z]+)(\/(.*))?)?/.exec(argument);

        return _.omit({
            action: groups[1],
            identifier: groups[3],
            path: groups[5]
        }, _.isUndefined);
    }
};

module.exports = (input, output, next) => {
    const answers = input.get('answers');

    if (answers && answers.action && answers.username) {
        // Another middleware already filled in
        // the user answers.
        return next();
    }
    input.set('answers', resolveParams(input));
    next();
};

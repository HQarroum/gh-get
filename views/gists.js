'use strict';

var _ = require('lodash');

/**
 * Displays the information associated with a
 * Gist.
 * @returns the formatted Gist information
 */
var information = (formatter, gist) => {
    formatter.log(`${formatter.title(`Gist ${gist.id} (${_.keys(gist.files).length} files(s))`)})
        \r${formatter.entry(gist.html_url)}
        \r${formatter.entry(gist.description ? gist.description : "(None)")}
    `);
};

module.exports = {
    render: { information }
};
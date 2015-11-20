'use strict';

/**
 * Displays the information associated with a
 * repository.
 * @returns the formatted repository information
 */
var information = (formatter, repository) => {
    formatter.log(`\r${formatter.title(repository.name)},
        \r${formatter.description(repository.description, '(None)')}
        \r${formatter.info(repository.html_url)}
        \r${formatter.info(`Project homepage: ${repository.homepage || '(None)'}`)}
        \r${formatter.info(`Language: ${repository.language || '(Not specified)'}`)}`);
};

module.exports = {
    render: { information }
};
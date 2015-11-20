var chalk = require('chalk');

/**
 * The `quit` middleware entry point.
 * @param input the input data store.
 * @param output the middleware output
 * @param next the callback to the next middleware
 */
module.exports = (input, output, next) => {
    if (input.get('answers:action') === 'quit') {
        output.log(chalk.yellow('Goodbye !'));
        process.exit(0);
    }
    next();
};
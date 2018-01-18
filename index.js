
const program = require('commander');
const commandLoader = require('./lib/command-loader');
const pkg = require('./package.json');
const logger = require('./lib/logger');
const colors = require('colors');

// set program
program.name(process.title);
program.description('web dev cli tool for node and ember-cli');
program.version(pkg.version);

logger.write(colors.yellow(" ______  _     _ _______ __   __ _  _  _ _______ ______ "));
logger.write(colors.yellow(" |_____] |     | |______   \\_/   |  |  | |______ |_____]"));
logger.write(colors.yellow(" |_____] |_____| ______|    |    |__|__| |______ |_____]"));
logger.write(colors.yellow("                                                        "));
logger.write(colors.green("version: " + pkg.version), "\n");


// load programm commmands
commandLoader(program, __dirname);

// parse args
program.parse(process.argv);

var morgan = require('morgan'),
    fs = require('fs'),
    logFile = process.env.LOGFILE || false;

function morganConfig(app, directory) {

    if (logFile && directory) {
        var accessLogStream = fs.createWriteStream(directory + logFile, {flags: 'a'});
        app.use(morgan('combined', {stream: accessLogStream}));
    }

}

module.exports = morganConfig;
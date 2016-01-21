// Express
var express = require('express'),
    bodyParser = require('body-parser'),
    session = require('express-session'),
    cookieParser = require('cookie-parser'),
    settings = require('./settings'),
    favicon = require('serve-favicon'),
    path = require('path'),
    sessionKey = process.env.SECRET || settings.sessionKey || 'some secret key goes here!',
    app = express();

// TODO: Change to use jwt's
app.use(session({secret: sessionKey, resave: true, saveUninitialized: true}));

// Setup
app.sdSettings = settings;
require('./src/config/mongoose')();
require('./src/config/morgan')(app, __dirname);
require('./src/config/passport')(app, {
    google: settings.google,
    twitter: settings.twitter,
    facebook: settings.facebook
});

// Middleware
app.set('views', path.join(__dirname, '/src/views'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

// Routers
var usersRouter = require('./src/users/routes')();
var articleRouter = require('./src/articles/routes')();
var authRouter = require('./src/auth/routes')();
var indexRouter = require('./src/index/routes')();

// API Routes
app.use('/api/users', usersRouter);
app.use('/api/articles', articleRouter);

// Routes
app.use('/auth', authRouter);
app.use('/', indexRouter);

module.exports = app;
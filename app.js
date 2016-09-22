//Twitter Appsにて取得したConsumer Key (API Key)とConsumer Secret (API Secret)を記述
process.env.TWITTER_CONSUMER_KEY = '6e7i5DiMideg5nMXjekOQycEv';
process.env.TWITTER_CONSUMER_SECRET = 'R3n5ckxxX1nTdN9IXjwOBzMDvTOVWghYfAXz59tBv4jIUEeMUM';
process.env.TWITTER_ACCESS_TOKEN='1519301972-tbPJALMAVlYggCCoLyz9Qv9DlbCdJTyo0wypnxI';
process.env.TWITTER_ACCESS_TOKEN='1519301972-XdUWyELrwIrRUaZYBotJYBQJK0bNZXWwdBSehoV';
process.env.TWITTER_ACCESS_TOKEN_SECRET='RhA6xH2YCErc2eMpCbnon2v9XpUAgRCGboNbR8jCWCgyS';


var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');


var oauth = require('./routes/oauth');
var routes = require('./routes/index');
var users = require('./routes/users');
var nowPlaying= require('./routes/NowPlaying');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(require('express-session')({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', routes);
app.use('/users', users);
app.use('/nowplaying',nowPlaying);
app.use('/oauth',oauth);

var TwitterStrategy = require('passport-twitter').Strategy;



passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (obj, done) {
  done(null, obj);
});

passport.use(new TwitterStrategy({
      consumerKey: process.env.TWITTER_CONSUMER_KEY,
      consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
      callbackURL: "http://localhost:3000/oauth/callback/" //Twitterログイン後、遷移するURL
    },
    function (token, tokenSecret, profile, done) {
      console.log(token, tokenSecret, profile);
      process.nextTick(function () {
        return done(null, profile);
      });
    }
));


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;

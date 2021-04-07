var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');


var indexControllers = require('./controllers/index');
var usersControllers = require('./controllers/users');
var exercisesController = require('./controllers/exercises');
var categoriesController = require('./controllers/categories');

const passport = require('passport')
const session = require('express-session')
const gitHubStrategy = require('passport-github2').Strategy

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'w21w0rkoutTr2cker!',
  resave: false,
  saveUninitialized:false
}))

app.use(passport.initialize())
app.use(passport.session())

const config = require('./config/globals')

const User = require('./models/user')
passport.use(User.createStrategy())


passport.use(new gitHubStrategy({
  clientID: config.github.clientId,
  clientSecret: config.github.clientSecret,
  callbackURL: config.github.callbackUrl
},
  
  async (accessToken, refreshToken, profile, done) => {
    
    const user = await User.findOne({ oauthId: profile.id})

    if (user) {
      return done(null, user)
    }
    else{
      const newUser = new User({
        username: profile.username,
        oauthId: profile.id,
        oauthProvider: 'Github',
        created: Date.now()
      })

      const savedUser = await newUser.save()
      done(null, savedUser)
    }
  }
))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use('/', indexControllers);
app.use('/users', usersControllers);
app.use('/exercises', exercisesController);
app.use('/categories', categoriesController);


//mongodb connection
const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://codeDictionary:codeDictionary@cluster0.sn2tz.mongodb.net/workoutTracker', 
  { useNewUrlParser: true, useUnifiedTopology: true })
  .then((res) => {
    console.log('Connected to MongoDB')
  })
  .catch(()=>{
    console.log('MongoDB Connection Failed')
  })

  // hbs helper function to pre-select correct dropdown option
const hbs = require('hbs')

hbs.registerHelper('createOption', (currentValue, selectedValue) => {
    // if values match add 'selected' to this option tag
    var selectedProperty = ''
    if (currentValue == selectedValue) {
        selectedProperty = ' selected'
    }

    console.log(currentValue + '/' + selectedValue)
    return new hbs.SafeString('<option' + selectedProperty + '>' + currentValue + '</option>')
})
hbs.registerHelper('shortDate', (dateVal) => {
  return new hbs.SafeString(dateVal.toLocaleDateString('en-US'))
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// app.get('/', () => res.render(''))

module.exports = app;

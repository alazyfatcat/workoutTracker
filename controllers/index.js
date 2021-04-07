var express = require('express');
var router = express.Router();
const passport = require('passport');
const multer = require('multer');



const User = require('../models/user')
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Workout Tracker' });
});

router.get('/register', function(req, res, next) {
  res.render('register', { title: 'Create an account' });
});

/* POST /register */
router.post('/register', (req, res, next) => {
  // invoke User model which extends passport-local-mongoose to create a new user in the db
  // password gets passed as separate param for hashing
  User.register(new User( {
    username: req.body.username
  }), req.body.password, (err, newUser) => {
    if (err) {
      return res.redirect('/register')
    }
    else {
      // login the user in automatically & go to projects list
      req.login(newUser, (err) => {
        res.redirect('/exercises')
      })
    }
  })
})

router.get('/login', function(req, res, next) {
 
  let messages = req.session.messages || [];
  req.session.messages = []; 

  res.render('login', {
    title: 'Please enter your credentials',
    messages: messages 
  })
});

router.post('/login', passport.authenticate('local', {
  successRedirect: '/exercises',
  failureRedirect: '/login',
  failureMessage: 'Invalid Login' 
}))

router.get('/logout', (req,res,nexdt) => {
  req.logout()
  res.redirect('/login')
})

/* GET /github - try github auth */
router.get('/github', passport.authenticate('github', { scope: ['user.email']}))

/* GET /github/callback - what to do after GitHub login */
router.get('/github/callback', passport.authenticate('github', {
  failureRedirect: '/login'}),
    (req, res, next) => {
      res.redirect('/exercises')
})

//uploads the image
const storage = multer.diskStorage({
  destination: './public/uploads/',
  filename: function(req, file, cb){
    cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

// Init Upload
const upload = multer({
  storage: storage,
  limits: {
      fileSize: 1000000
  },
  fileFilter: function(req, file, cb){
      checkFileType(file, cb);
  }
}).single('myImage');

//check file type
function checkFileType(file, cb){
  //allow ext
  const filetypes = /jpeg|jpg|png|gif/;
  //check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  //check mime types
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname ){
      return cb(null, true);
  }else{
      cb('error: images only')
  }
}

module.exports = router;

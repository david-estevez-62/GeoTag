var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var mongoose = require('mongoose');
var flash = require('connect-flash');
var session = require('express-session');

var indexController = require('./controllers/index.js');
var loginController = require('./controllers/login.js');
var adminController = require('./controllers/admin');
var userController = require('./controllers/users');

// Seed the database
var Weapons = require('./models/seeds/seed.js');

var User = require('./models/users.js');
var Weapon = require('./models/weapons.js');






var passport = require('passport');
var passportConfig = require('./config/passport');


mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/warrior');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));



var app = express();
app.set('view engine', 'jade');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: false}));


app.use(require('express-session')({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));


app.use(cookieParser());
app.use(flash());

app.use(passport.initialize());

app.use(passport.session());







// Our get request for viewing the login page
app.get('/login', adminController.login);

// Post received from submitting the login form
app.post('/login', adminController.processLogin);

// Post received from submitting the signup form
app.post('/signup', adminController.processSignup);

// Any requests to log out can be handled at this url
app.get('/logout', adminController.logout);




app.get('/', loginController.login);
app.get('/createacct', function (req, res) {
  res.render('createacct');
});


app.use(passportConfig.isLoggedIn);



//////////////////////////////////////////////////////////////////////////////////////





app.get('/home', indexController.index);

// Get Users location signed in(/App is open)
app.post('/locate', userController.locate);






app.get('/scan', userController.scan)
app.get('/weapon', function(req, res){
  console.log(req.query.weapon)

  Weapon.findOne({"name": req.query.weapon}, function(err, data){
    console.log(data.imageUrl)

    res.send(data);
  });

});






var server = app.listen(4613, function() {
	console.log('Express server listening on port ' + server.address().port);
});

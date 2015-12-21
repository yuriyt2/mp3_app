var express = require('express');
var logger = require('morgan');
var session = require('express-session');
var bodyParser = require('body-parser');
var User = require('models/user.js');
var mongoose = require('mongoose');
var app = express();

app.use(bodyParser({limit: '50mb'})); //allows large updates when refreshing a user's song list

app.use(logger('dev'));
app.use(express.static('./public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
  secret: 'music app secret', 
  saveUninitialized: false,
  resave: false
}));



//establish mongo connection
mongoose.connect('mongodb://localhost/mp3App', function (err) {
  if (err) {
    console.log(err);
  } else {
    console.log('Mongo Connection Successful');
  }
});

//set up port to run on
app.listen(3000,function(){console.log("Server Running on 3000")});


// app.get('/user', function(res,req){
//   req.sendfile(__dirname + "/public/login.html")
// })


app.get('/users/:id', function(req, res) {
  console.log("got id" + req.params.id)
    User.find({
      _id:req.params.id
    }).populate('songs').exec(function(err, user) {
      res.send(user);
    });
  });
//
//   var restrictAccess = function (req, res, next) {
//     var sessionId = req.session.currentUser;
//     var reqId = req.params.id;
//     sessionId = reqId ? next() : res.status(400).send({err: 400, msg: "You shall not pass"});
//   };
//
//   var authenticate = function (req, res, next) {
//     req.session.currentUser ? next() : res.status(403).send({err: 403, msg: "log in troll"});
//   };
//
//   app.get('/users/:id', authenticate, restrictAccess, function (req, res) {
//     User.findById(req.params.id).exec(function (err, user) {
//       res.send(user);
//     });
//   });
//
  app.post('/users/', function(req,res){
    console.log(req.body)
    console.log("hi")
    var user = new User(req.body);
    User.findOne({
      username: req.body.username
    }).exec(function(err,results){
      if (results !== null){
        res.send('User already exists.')
      }else if (req.body.password.length < 5){
         res.send('Password should be at least 5 letters long.')}
      else {user.save(function(err) {
              if (err) {
                console.log(err);
              } else {
                console.log("User saved");
                res.send("Account created. Please log in.");
              }
            });
          }
      })
  })

//Update a user's songs.
  app.put('/users/:id', function (req, res) {
    console.log(JSON.parse(req.body.songs))
    User.findOneAndUpdate({
      _id:req.params.id
    }, {
       $set: {songs: JSON.parse(req.body.songs)}
    }, function(err, user) {
      console.log(user);
      res.send("Songs successfully saved.");
    });
  });



// app.get('/sessions', function(req,res){
//   console.log(req.session)
//   if (req.session.currentUser){
//     console.log(req.session.currentUser)
//     res.send("User logged in.")
//   } else {
//     res.sendFile(__dirname + "/public/index.html")
//     //res.sendStatus(400)
//   }
// })

app.post('/sessions', function(req,res){
  User.find({
     username: req.body.username
   }).exec(function(err, user) {
     console.log(user)
     if (user[0] === undefined){
     res.send('User not found.')
     console.log(req.session)}
     else{
     user[0].comparePassword(req.body.password, function(err, isMatch) {
       if (isMatch) {
         console.log("logged in");
         console.log(user[0]._id)
         req.session.currentUser = user[0]._id;
         res.send(user);
         console.log("User is" + user)
         console.log(req.session)
       } else {
         res.send('Incorrect password.');
         }
       });
     };
   });
});

app.delete('/sessions', function(req,res){
  req.session.currentUser = null;
  console.log('logged out');
  res.send(__dirname + "/public/index.html")
})

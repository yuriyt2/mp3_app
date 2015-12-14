console.log("User.js");

var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var UserSchema = new mongoose.Schema({
  username: String,
  password: String,
  token: String,
  songs: [{
    id: Number,
    filepath: String,
    tempUrl: String,
    artist: String,
    title: String,
    album: String,
    year: String
  }]
});

UserSchema.pre('save', function (next) {
  var currentUser = this;

  //only hash the password if it has been modified
  if(!currentUser.isModified('password')) return next();
  bcrypt.genSalt(15, function (err, salt) {
    if(err) return next();

  //hash the password using bcypt
    bcrypt.hash(currentUser.password, salt, function (err, hashedPassword) {
      if(err) return next();

  //replace the user's password with the hashed password
      currentUser.password = hashedPassword;
      next();
    });
  });
});

UserSchema.methods.comparePassword = function (userPassword, callback) {
  bcrypt.compare(userPassword, this.password, function (err, isMatch) {
    if(err) return callback(err);
    callback(null, isMatch);
  });
} ;

var User = mongoose.model('User', UserSchema);

module.exports = User;

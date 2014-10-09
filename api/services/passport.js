var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;


function findById(id, fn) {
  User.findOne({ '_id' : id }, {'password': false}).done(function (err, user) {
    if (err) {
      return fn(null, null);
    } else {
      return fn(null, user);
    }
});
}

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findOne({id:id}, function(err, user) {    
    done(err, user);
  });
});

passport.use(new LocalStrategy(
  function(username, password, done) {
    process.nextTick(function () {
      
      User.findOne({ email: username }, function(err, user) {

      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (!user.validPassword(password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });  
    });
    
    
  }
));
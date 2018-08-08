var bCrypt = require("bcrypt-nodejs");
var GoogleStrategy = require("passport-google-oauth2").Strategy;

// API Access link for creating client ID and secret:
// https://code.google.com/apis/console/
var GOOGLE_CLIENT_ID =
  "340545464135-1jgce11ie8bff4t7bovmjn5gc06vb9jj.apps.googleusercontent.com";
GOOGLE_CLIENT_SECRET = "9ANVuRzPninHJ-NqSJTuOy0b";

module.exports = function(passport, user) {
  //sets the User variable to equal the current user in session
  var User = user;
  console.log(User);

  //This is the strategy we will be using, this is installed ed as an npm package
  var LocalStrategy = require("passport-local").Strategy;
  //This is set for later use
  //var userId;

  passport.use(
    "local-signup",
    new LocalStrategy(
      {
        //'email' and 'password' are ids in the signup form
        usernameField: "username",
        passwordField: "password",
        //emailField: 'email',
        passReqToCallback: true // allows us to pass back the entire request to the callback
      },

      function(req, username, password, done) {
        var toCaps = function(word) {
          var splitWordArray = word.split("");
          var newCapsWord = splitWordArray[0].toUpperCase();
          splitWordArray[0] = newCapsWord;
          var finalWord = splitWordArray.join("");
          return finalWord;
        };

        var generateHash = function(password) {
          //This handles the encryption of the users password
          return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);
        };
        //Sequelize function
        User.findOne({
          where: {
            //finds user based on email                userName: username,
            userName: username
          }
          //This then function ensures that if there is already a matching email, the account cant be created
        }).then(function(user) {
          if (user) {
            return done(null, false, {
              message: "That username or email is already taken"
            });
          } else {
            //runs userPassword thorugh encryption
            var userPassword = generateHash(password);
            //These are the entries for the database
            var data = {
              email: req.body.email,
              password: userPassword,
              firstName: toCaps(req.body.firstname),
              lastName: toCaps(req.body.lastname),
              userName: req.body.username,
              image: req.body.image
            };

            //pass the entries into a create Sequelize fuction
            User.create(data).then(function(newUser, created) {
              if (!newUser) {
                return done(null, false);
              }
              if (newUser) {
                return done(null, newUser);
              }
            });
          }
        });
      }
    )
  );

  passport.use(
    "local-signin",
    new LocalStrategy(
      {
        // by default, local strategy uses username and password, we will override with email
        usernameField: "username",
        passwordField: "password",
        passReqToCallback: true // allows us to pass back the entire request to the callback
      },
      function(req, username, password, done) {
        var User = user;
        //function checks if the password in the database matches the user-inputted password to login
        var isValidPassword = function(userpass, password) {
          return bCrypt.compareSync(password, userpass);
        };
        //Sequelize function to find matching email in the Users table
        User.findOne({
          where: {
            userName: username
          }
        })
          .then(function(user) {
            if (!user) {
              //if there is no matching email in the Users table do not allow login and alert the user
              return done(null, false, {
                message: "Email does not exist"
              });
            }
            if (!isValidPassword(user.password, password)) {
              //if the password does not match the database password, do not let user log in and alert them
              return done(null, false, {
                message: "Incorrect password."
              });
            }
            var userinfo = user.get();
            return done(null, userinfo);
            //Error Handling
          })
          .catch(function(err) {
            console.log("Error:", err);
            return done(null, false, {
              message: "Something went wrong with your Signin"
            });
          });
      }
    )
  );

  //serialize
  passport.serializeUser(function(user, done) {
    done(null, user.id);
    console.log("ID:" + user.id + " user name:" + user.userName);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id).then(function(user) {
      if (user) {
        done(null, user.get());
        console.log("ID:" + user.id + " user name:" + user.userName);
        // userId = id;
      } else {
        done(user.errors, null);
      }
    });
  });

  // Use the GoogleStrategy within Passport.
  //   Strategies in Passport require a `verify` function, which accept
  //   credentials (in this case, an accessToken, refreshToken, and Google
  //   profile), and invoke a callback with a user object.
  passport.use(
    new GoogleStrategy(
      {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        //NOTE :
        //Carefull ! and avoid usage of Private IP, otherwise you will get the device_id device_name issue for Private IP during authentication
        //The workaround is to set up thru the google cloud console a fully qualified domain name such as http://mydomain:3000/
        //then edit your /etc/hosts local file to point on your private IP.
        //Also both sign-in button + callbackURL has to be share the same url, otherwise two cookies will be created and lead to lost your session
        //if you use it.
        callbackURL:
          "https://damp-everglades-38496.herokuapp.com/auth/google/callback",
        passReqToCallback: true
      },
      function(request, accessToken, refreshToken, profile, done) {
        // asynchronous verification, for effect...
        process.nextTick(function() {
          // To keep the example simple, the user's Google profile is returned to
          // represent the logged-in user.  In a typical application, you would want
          // to associate the Google account with a user record in your database,
          // and return that user instead.
          return done(null, profile);
        });
      }
    )
  );
};

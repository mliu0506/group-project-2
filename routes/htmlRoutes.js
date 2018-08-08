//var path = require("path");
var db = require("../models");
var passport = require("passport");
var Sequelize = require('sequelize');
const Op = Sequelize.Op;

module.exports = function(app) {
  // GET /auth/google
  //   Use passport.authenticate() as route middleware to authenticate the
  //   request.  The first step in Google authentication will involve
  //   redirecting the user to google.com.  After authorization, Google
  //   will redirect the user back to this application at /auth/google/callback
  app.get(
    "/auth/google",
    passport.authenticate("google", {
      scope: [
        "https://www.googleapis.com/auth/plus.login",
        "https://www.googleapis.com/auth/plus.profile.emails.read"
      ]
    })
  );

  // GET /auth/google/callback
  //   Use passport.authenticate() as route middleware to authenticate the
  //   request.  If authentication fails, the user will be redirected back to the
  //   login page.  Otherwise, the primary route function function will be called,
  //   which, in this example, will redirect the user to the home page.
  app.get(
    "/auth/google/callback",
    passport.authenticate("google", {
      successRedirect: "/project",
      failureRedirect: "/auth"
    })
  );

  app.get("/auth", notLoggedIn, function(req, res) {
    res.render("index", { layout: "login" });
  });

  app.get("/auth", function(req, res) {
    res.render("index");
  });
  
  app.get("/", isLoggedIn, function(req, res) {
    res.render("project");
  });

  //This handles the get request for the current users project page
  app.get("/dashboard", isLoggedIn, function(req, res) {
    var hbObject = {
      //has all matching goals from search
      //current session's user
      user: req.user
    };
    //console.log for test
    console.log("dasboard");
    //renders handlebars project page to file to handlebars to generate projects and user info
    res.render("dashboard", hbObject);
  });

  //This handles the get request for the current users project page
  app.get("/project", isLoggedIn, function(req, res) {
    //sequelize function to findall of project in database where conditions are met
    db.Project.findAll({}).then(function(dbProject) {
      //Object to send to the handlebars file
      var hbObject = {
        //has all matching goals from search
        projects: dbProject,
        //current session's user
        user: req.user
      };
      //console.log for test
      console.log(hbObject.projects);
      //renders handlebars project page and gives hbObject to file to handlebars to generate projects and user info
      res.render("project", hbObject);
    });
  });

  app.get("/task", isLoggedIn, function(req, res) {
    db.Task.findAll({
      where: {
        userName: req.user.userName
      }
    }).then(dbTask => {
      let hbObject = {
        user: req.user,
        tasks: dbTask
      };

      res.render("tasks", hbObject);
    });
  });

  app.get("/inbox", isLoggedIn, function(req, res) {
    db.Comment.findAll({
      where: {
        touserName: req.user.userName
      }
    }).then(dbComment => {
      let hbObject = {
        user: req.user,
        comments: dbComment
      };

      res.render("inbox", hbObject);
    });
  });

    //This handles the get request for the current users task page
    app.get("/addtask", isLoggedIn, function(req, res) {
      //sequelize function to findall off tasks in database where conditions are met
      db.Task.findAll({}).then(function(dbTask) {
        //Object to send to the handlebars file
        var hbObject = {
          //has all matching task frrom search
          tasks: dbTask,
          //current session's user
          user: req.user
        };
        //console.log for test
        console.log(hbObject.tasks);
        console.log(hbObject.user);
        //renders handlebars project page and gives hbObject to file to handlebars to generate projects and user info
        res.render("addtask", hbObject);
      });
    });


    //This handles the get request for the current users comment page
    app.get("/addcomment", isLoggedIn, function(req, res) {
      //sequelize function to findall off tasks in database where conditions are met
      db.Comment.findAll({}).then(function(dbComment) {
        //Object to send to the handlebars file
        var hbObject = {
          //has all matching task frrom search
          comments: dbComment,
          //current session's user
          user: req.user
        };
        //console.log for test
        console.log(hbObject.comments);
        //renders handlebars project page and gives hbObject to file to handlebars to generate projects and user info
        res.render("addcomment", hbObject);
      });
    });
  //this handles the get requests for searches, the :name is provided on the client side search.js file
  app.get("/search/:name", isLoggedIn, (req, res) => {
     console.log("recieved search request")
     //sequelize function to find all users that match params
     db.Task.findAll({
        where: {
         // [Op.and]: {
              userName: req.params.name
              // id: {
              //        [Op.ne]: req.user.id
              //     }
         //     }
            //only finds users that have a first name of whatever name was searched  
            }
      }).then(dbTask => {
            //provides an object to send to handlebars with the searched users data
            let hbObject = {
                user: req.user,
                tasks: dbTask
            };
            //console.log for test
            console.log(hbObject.tasks);
            //load the search handlebars file and pass it the hbObject to provide a list of matched users
            res.render("search", hbObject);
      });
  });


  app.get("/logout", function(req, res) {
    //This ends the current user session which is key to authentication
    req.session.destroy(function(err) {
      //sends user back to the signup/login page
      res.render("index", { layout: "login" });
    });
  });

  //These signup and signin posts use passport.js file to either setup an account or log in to there account.

  app.post(
    "/signup",
    passport.authenticate("local-signup", {
      //on success redirect user to project handlebars
      successRedirect: "/project",
      //on failure redirect users back to the login/signup page
      failureRedirect: "/auth"
    })
  );

  app.post(
    "/signin",
    passport.authenticate("local-signin", {
      //on success redirect user to project handlebars
      successRedirect: "/project",
      //on failure redirect users back to the login/signup page
      failureRedirect: "/auth"
    })
  );

  //This is the isLoggedIn function used for the get requests
  function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }

    res.set(
      "Cache-Control",
      "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
    );
    res.redirect("/auth");
  }

  function notLoggedIn(req, res, next) {
    if (!req.isAuthenticated()) {
      return next();
    }

    res.redirect("/project");
  }


};

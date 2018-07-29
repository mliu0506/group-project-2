var db = require("../models");

module.exports = function(app) {
  //this function handles the request to create a new project
  app.post("/api/projects", function(req, res) {
    //req.body is equal to the data we sent in the ajax call on search.js
    var newProject = req.body;

    //creates a new project in the database
    db.Project.create(newProject).then(function(dbProject) {
      res.json(dbProject);
    });
  });
  //this function handles the request to change a project to completed
  app.put("/api/projects/:id", function(req, res) {
    //updates the Projects table with completed: true
    db.Project.update(
      //req body matches the toggleBool object from site.js
      req.body,
      {
        //condition for the matching project
        where: {
          id: req.params.id
        }
      }
    ).then(function(dbProject) {
      //return json of the project
      res.json(dbProject);
    });
  });
  //this function is for handling the request to change a profile picture img src url
  app.put("/api/profile", function(req, res) {
    db.User.update(
      //this is the new profile url
      req.body,
      {
        where: {
          //specific user primary key id
          id: req.user.id
        }
      }
    ).then(function(dbUser) {
      res.json(dbUser);
    });
  });
  //this handles deleting all of the completer projects
  app.delete("/api/projects", function(req, res) {
    console.log(req.user.id);
    db.Project.destroy({
      where: {
        //completed is a boolean value in the users table
        completed: true
      }
    }).then(function(dbProject) {
      res.json(dbProject);
    });
  });
  //The delete call removes a project from the project list in the profile page. This completely removes it from the table
  //and then sends Json data
  app.delete("/api/projects/:id", function(req, res) {
    db.Project.destroy({
      where: {
        //id of project
        id: req.params.id
      }
    }).then(function(dbProject) {
      res.json(dbProject);
    });
  });

  //This function gets the session data for the user and gets there id
  app.get("/api/user_data", function(req, res) {
    if (req.user === undefined) {
      // The user is not logged in
      res.json({});
    } else {
      //User is logged in
      res.json({
        //sedns userId
        userId: req.user.id
      });
    }
    app.get("/api/user_data", function(req, res) {
      if (req.user === undefined) {
        // The user is not logged in
        res.json({});
      } else {
        res.json({
          userId: req.user.id
        });
      }
    });
  });
};

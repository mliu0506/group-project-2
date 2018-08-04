var db = require("../models");

module.exports = function(app) {
  app.get("/api/users", function(req, res) {
    //sequelize function to findall of project in database where conditions are met
    db.User.findAll({ attributes: ["image", "userName"] }).then(function(
      dbUser
    ) {
      //console.log for test
      console.log(dbUser);
      //Object to send to the json file
      res.json(dbUser);
    });
  });
  app.get("/api/projects", function(req, res) {
    //sequelize function to findall of project name in database where conditions are met
    db.Project.findAll({
      attributes: ["projectName"],
      where: {
        completed: false
      }
    }).then(function(dbProject) {
      //console.log for test
      console.log(dbProject);
      //Object to send to the json file
      res.json(dbProject);
    });
  });
  app.get("/api/tasks", function(req, res) {
    //sequelize function to findall of task name in database where conditions are met
    db.Task.findAll({
      attributes: ["taskName"],
      where: {
        completed: false
      }
    }).then(function(dbTask) {
      //console.log for test
      console.log(dbTask);
      //Object to send to the json file
      res.json(dbTask);
    });
  });
  //this function handles the request to create a new project
  app.post("/api/projects", function(req, res) {
    //req.body is equal to the data we sent in the form
    var newProject = {
      projectName: req.body.projectname,
      projectDescription: req.body.projectdescription,
      completed: false
    };
    db.Project.create(newProject).then(function() {
      res.redirect("/project");
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
  //this function handles the request to create a new task
  app.post("/api/tasks", function(req, res) {
    //req.body is equal to the data we sent from the add-task form
    var newTask = {
      taskName: req.body.taskname,
      category: req.body.category,
      startDate: req.body.startdate,
      endDate: req.body.enddate,
      status: req.body.status,
      completed: false,
      userName: req.body.userName,
      image: "",
      projectName: req.body.projectName
    };
    var array = newTask.userName.split(",");
    newTask.userName = array[0];
    newTask.image = array[1];
    //creates a new task in the database
    db.Task.create(newTask).then(function() {
      res.redirect("/addtask");
    });
  });
  //this function handles the request to create a new comment
  app.post("/api/comments", function(req, res) {
    //req.body is equal to the data we sent from the add-comment form
    var newComment = {
      comment: req.body.comment,
      taskName: req.body.taskName,
      completed: false,
      touserName: req.body.touserName,
      toImage: "",
      fromuserName: req.user.userName,
      fromImage: req.user.image
    };
    var array = newComment.touserName.split(",");
    newComment.touserName = array[0];
    newComment.toImage = array[1];
    console.log("create Comments");
    db.Comment.create(newComment).then(function() {
      res.redirect("/addcomment");
    });
  });

  //this function handles the request to change a task to completed
  app.put("/api/tasks/:id", function(req, res) {
    //updates the Tasks table with status
    db.Task.update(
      //req body matches the toggleBool object from site.js
      req.body,
      {
        //condition for the matching project
        where: {
          id: req.params.id
        }
      }
    ).then(function(dbTask) {
      //return json of the task
      res.json(dbTask);
    });
  });

  //this function handles the request to change a comment to completed
  app.put("/api/comments/:id", function(req, res) {
    //updates the Comments table with completed: true
    db.Comment.update(
      //req body matches the toggleBool object from site.js
      req.body,
      {
        //condition for the matching project
        where: {
          id: req.params.id
        }
      }
    ).then(function(dbComment) {
      //return json of the project
      res.json(dbComment);
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
  //The delete call removes a task from the task list in the profile page. This completely removes it from the table
  //and then sends Json data
  app.delete("/api/tasks/:id", function(req, res) {
    db.Task.destroy({
      where: {
        //id of project
        id: req.params.id
      }
    }).then(function(dbTask) {
      res.json(dbTask);
    });
  });
  //The delete call removes a task from the comment list in the profile page. This completely removes it from the table
  //and then sends Json data
  app.delete("/api/comments/:id", function(req, res) {
    db.Comment.destroy({
      where: {
        //id of project
        id: req.params.id
      }
    }).then(function(dbComment) {
      res.json(dbComment);
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

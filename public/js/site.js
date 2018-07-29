(function() {
  "use strict";
  window.addEventListener(
    "load",
    function() {
      // Fetch all the forms we want to apply custom Bootstrap validation styles to
      var forms = document.getElementsByClassName("needs-validation");
      // Loop over them and prevent submission
      var validation = Array.prototype.filter.call(forms, function(form) {
        form.addEventListener(
          "submit",
          function(event) {
            if (form.checkValidity() === false) {
              event.preventDefault();
              event.stopPropagation();
            }
            form.classList.add("was-validated");
          },
          false
        );
      });
    },
    false
  );
})();
//executes these event listeners when the page is loaded
$(document).ready(function() {
  $("#sign-up-btn").on("click", function(event) {
    event.preventDefault();
  });

  $(".profile-pic").hover(
    function() {
      $(".fa-images").css("visibility", "visible");
    },
    function() {
      $(".fa-images").css("visibility", "hidden");
    }
  );

  //This button click controls the project submitting client side logic
  $("#project-submit").on("click", function(event) {
    event.preventDefault();
    console.log("add clicked");
    //populates an object to send as a request, keys match names in the database
    var newProject = {
      //UserId : userId
      projectName: $("#project-name-input")
        .val()
        .trim(),
      projectDescription: $("#project-description-input")
        .val()
        .trim(),
      completed: false
    };
    //The actual ajax call
    $.ajax("/api/projects", {
      type: "POST",
      data: newProject
    }).then(
      //console.log created new project and reload the page
      function() {
        console.log("Created new project");
        location.reload();
      }
    );
  });
  //This PUT request is to change the projects from incomplete to completed
  $(".incomplete-circle").on("click", function(event) {
    event.preventDefault();
    //gets the id of the project in the database
    var id = $(this).data("id");
    //Lets user know project button has recognized the button click
    console.log("Project clicked: " + id);
    //toggleBool is the object we send with the PUT request
    var toggleBool = {
      completed: true
    };
    //The actual ajax call, includes the previous id as part the the url
    $.ajax("/api/projects/" + id, {
      type: "PUT",
      data: toggleBool
    }).then(function() {
      location.reload();
    });
  });
  //This button click is in charge of updating the img src url for the users profile picture
  $("#profile-pic-change-submit").on("click", function(event) {
    event.preventDefault();
    //gets the new url for img src
    var input = $("#profile-pic-change")
      .val()
      .trim();
    //puts url in an object to send as a request
    var changePic = {
      image: input
    };
    //a flag to make sure the form has been filled out
    if (input !== "") {
      //the actual ajax call
      $.ajax("/api/profile", {
        type: "PUT",
        data: changePic
      }).then(function() {
        //reload the page after request is sent
        location.reload();
      });
    }
  });
  //This on click function controls the trigger for deleting a users completed projects
  $("#del-completed-projects").on("click", function(event) {
    event.preventDefault();
    //in this case most of the information for handling this request is either passed by passportjs
    //as req.users or is already in our database, so no extra data is being sent with the request
    console.log("Project deleted");
    //the actual ajax call, only gives a url and a type
    $.ajax("/api/projects/", {
      type: "DELETE"
    }).then(function() {
      //reload page after request is sent
      location.reload();
    });
  });
  //this on click function controls the deletion of a single project from the database
  $(".fa-trash-alt").on("click", function(event) {
    event.preventDefault();
    //gets the id number of the project and assigns it to a variable
    var id = $(this).data("id");
    console.log("Project deleted:" + id);
    //actual ajax call, url includes specific id number of the project
    $.ajax("/api/projects/" + id, {
      type: "DELETE"
    }).then(function() {
      //reload the page after reuqest has been sent
      location.reload();
    });
  });
});

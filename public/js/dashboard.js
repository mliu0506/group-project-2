//executes event listeners on page load
$(document).ready(function() {
  //declares an empty variable
  var arrayprojectName = [];
  var arraycategory = [];
  var arraycompleted = [];
  var arrayoverdue = [];
  $.ajax("/api/category", {
    type: "GET"
  }).then(
    //get user data
    function(data) {
      console.log("Get Task List (Project Name & Category) for the Dashboard");
      $.each(data, function(index, item) {
        arrayprojectName.push(item.projectName);
        arraycategory.push(item.category);
      });
    }
  );

  console.log(arrayprojectName[0]);
  console.log(arraycategory);
  console.log(arraycompleted);
  console.log(arrayoverdue);

  Highcharts.chart("container", {
    chart: {
      polar: true,
      type: "line"
    },

    title: {
      text: 'Project 1 - Mission to the Moon',
      x: -80
    },

    pane: {
      size: "80%"
    },

    xAxis: {
      categories: ['Administration', 'Customer Support', 'Development', 'Marketing',
      'Planning', 'Testing'],
      tickmarkPlacement: "on",
      lineWidth: 0
    },

    yAxis: {
      gridLineInterpolation: "polygon",
      lineWidth: 0,
      min: 0
    },

    tooltip: {
      shared: true,
      pointFormat:
        "<span style=\"color:{series.color}\">{series.name}: <b>{point.y:,.0f}</b><br/>"
    },

    legend: {
      align: "right",
      verticalAlign: "top",
      y: 70,
      layout: "vertical"
    },

    series: [
      {
        name: "Completed",
        data: [5, 4, 5, 2, 5, 1],
        pointPlacement: "on"
      },
      {
        name: "Overdue",
        data: [2, 1, 2, 1, 0, 3],
        pointPlacement: "on"
      }
    ]
  });
});

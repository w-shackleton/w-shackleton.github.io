$(document).ready(function() {
  var canvas = $("#ray").get(0);
  var ctx = canvas.getContext("2d");

  var scene = new Scene([
      // Floor
//      new Plane(new Vector(0,0,-5), new Vector(0,0,-1), new Props(
//          {col: BLACK},
//          {col: WHITE.mul(1)},
//          {col: BLACK, stdev: 0.1})),
      new Sphere(new Vector(0,0,-103),100, new Props(
          {col: BLACK},
          {col: new Colour(100, 100, 100)},
          {col: BLACK, stdev: 0.1})),

      // Spheres
      new Sphere(new Vector(-2,0,0),1, new Props(
          {col: BLACK},
          {col: new Colour(255, 40, 0)},
          {col: WHITE.mul(0.7), stdev: 0.2})),
      new Sphere(new Vector(0,0,0),1, new Props(
          {col: BLACK},
          {col: new Colour(0, 255, 20)},
          {col: WHITE.mul(0.6), stdev: 0.05})),
      new Sphere(new Vector(2,0,0),1, new Props(
          {col: BLACK},
          {col: new Colour(0, 30, 255)},
          {col: WHITE.mul(0.4), stdev: 0})),

      new Sphere(new Vector(2,2,-2),1, new Props(
          {col: BLACK},
          {col: BLACK},
          {col: WHITE.mul(0.8), stdev: 0})),
      new Sphere(new Vector(-2,10,-2),1, new Props(
          {col: BLACK},
          {col: new Colour(255, 100, 50)},
          {col: BLACK, stdev: 0})),
      new Sphere(new Vector(0,5,-2),1, new Props(
          {col: BLACK},
          {col: new Colour(255, 100, 50)},
          {col: BLACK, stdev: 0})),

      // Light source
      new Sphere(new Vector(0,3,15),1, new Props(
          {col: WHITE.mul(0.9)},
          {col: BLACK},
          {col: BLACK, stdev: 0})),
      new Sphere(new Vector(-10,-4,-1),1, new Props(
          {col: WHITE.mul(0.9)},
          {col: BLACK},
          {col: BLACK, stdev: 0})),
      new Sphere(new Vector(10,-4,-1),1, new Props(
          {col: WHITE.mul(0.9)},
          {col: BLACK},
          {col: BLACK, stdev: 0})),
    ],
    new Vector(0, -6, 0),
    {
      tl: new Vector(-4, 0, 2),
      tr: new Vector(4, 0, 2),
      bl: new Vector(-4, 0, -2.5),
      br: new Vector(4, 0, -2.5),
    }, 0,
    new Colour(20, 20, 20));

  var delta = 10;

  var iters = 100;
  var rounds = 0; // 10 - iters

  var do_row = function(y) {
    var dest_y = y+delta;
    var start_y = y;
    var ptr = 0;
    var row = ctx.getImageData(0, start_y, canvas.width, delta);
    var data = row.data;
    for (; y < canvas.height && y < dest_y; y++) {
      for (var x = 0; x < canvas.width; x++) {
        var r_x = x + (Math.random() - 1);
        var r_y = y + (Math.random() - 1);
        var result = scene.trace(r_x / canvas.width, r_y / canvas.height);
        data[ptr] = (data[ptr] * rounds + result.col.r) / (rounds+1);
        ptr++;
        data[ptr] = (data[ptr] * rounds + result.col.g) / (rounds+1);
        ptr++;
        data[ptr] = (data[ptr] * rounds + result.col.b) / (rounds+1);
        ptr++;
        data[ptr] = 255;
        ptr++;
      }
      ctx.putImageData(row, 0, start_y);
    }
    if (y < canvas.height) {
      setTimeout(do_row, 0, y);
    } else if (iters > 0) {
      iters--;
      rounds++;
      setTimeout(do_row, 0, 0);
      $("#status").text(""+rounds+"/100 iterations");
    }
  };
  do_row(0);
});

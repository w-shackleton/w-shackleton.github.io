$(document).ready(function() {
  var canvas = $("#ray").get(0);
  var ctx = canvas.getContext("2d");

  var scene = new Scene([
      new Sphere(new Vector(-1,1,0),1, new Props(
          {col: new Colour(50, 0, 0)},
          {col: WHITE.mul(0.3)},
          {col: WHITE.mul(0.7), stdev: 0.1})),
      new Sphere(new Vector(1,4,1),1, new Props(
          {col: WHITE.mul(0.9)},
          {col: WHITE.mul(0.3)},
          {col: BLACK, stdev: 0})),
      new Sphere(new Vector(2,0,0),0.5, new Props(
          {col: WHITE.mul(0.7)},
          {col: WHITE.mul(0.3)},
          {col: WHITE.mul(0.5), stdev: 0.1})),
    ],
    new Vector(0, -4, 0),
    {
      tl: new Vector(-1, -2, 1),
      tr: new Vector(1, -2, 1),
      bl: new Vector(-1, -2, -1),
      br: new Vector(1, -2, -1),
    });

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
        var result = scene.trace(x / canvas.width, y / canvas.height);
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

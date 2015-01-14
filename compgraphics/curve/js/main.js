$(document).ready(function() {
  var canvas = $("#canvas").get(0);
  var ctx = canvas.getContext("2d");

  draw_bezier(ctx, "rgba(0, 255, 30, 1)", "rgba(255, 20, 100, 1)",
    new Vector(20, 20), new Vector(90, 95),
    new Vector(170, 05), new Vector(200, 100));
});

function draw_bezier(ctx, linecol, col, a, b, c, d) {
  draw_line(ctx, linecol, a, b);
  draw_line(ctx, linecol, b, c);
  draw_line(ctx, linecol, c, d);
  partial(ctx, col, a, b, c, d);
}

function partial(ctx, col, a, b, c, d) {
  // Check if can approximate as line
  if (a.subtract(b).length() < 2 &&
      b.subtract(c).length() < 2 &&
      c.subtract(d).length() < 2) {
    draw_line(ctx, col, a, d);
    return;
  }

  var bc_mid = Vector.lerp(b, c, 0.5);

  // Find new Bezier points
  var a1 = a;
  var b1 = Vector.lerp(a, b, 0.5);
  var c1 = Vector.lerp(b1, bc_mid);

  var d2 = d;
  var c2 = Vector.lerp(d, c, 0.5);
  var b2 = Vector.lerp(c2, bc_mid);

  var a2 = d1 = Vector.lerp(c1, b2, 0.5);
  partial(ctx, col, a1, b1, c1, d1);
  partial(ctx, col, a2, b2, c2, d2);
}

function draw_line(ctx, col, a, b) {
  var vertical = Math.abs((b.y - a.y) / (b.x - a.x)) > 1;
  var start = vertical ? a.y : a.x;
  var end = vertical ? b.y : b.x;

  if (start > end) {
    draw_line(ctx, col, b, a);
    return;
  }

  for (var i = start; i <= end; i++) {
    var x, y;
    if (vertical) {
      y = i;
      x = (y - a.y) * (b.x - a.x) / (b.y - a.y) + a.x;
    } else {
      x = i;
      y = (x - a.x) * (b.y - a.y) / (b.x - a.x) + a.y;
    }
    setpixel(ctx, col, x, y);
  }
}

function setpixel(ctx, col, x, y) {
  ctx.fillStyle = col;
  ctx.fillRect(Math.round(x), Math.round(y), 1, 1);
}

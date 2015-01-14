$(document).ready(function() {
  var canvas = $("#canvas").get(0);
  var ctx = canvas.getContext("2d");

  draw_triangle(ctx, "rgba(255, 20, 100, 1)", new Vector(20, 20), new Vector(90, 95), new Vector(70, 05));
});

function draw_triangle(ctx, col, a, b, c) {
  var pts = [a, b, c];
  // Sort by x
  pts.sort(function(l, r) {
    return l.x - r.x;
  });

  // Draw from point 0 to point 1, drawing vertical scan lines.
  for (var x = pts[0].x; x < pts[1].x; x++) {
    // Interpolate to find y positions
    var y1 = Math.round(pts[0].y + (pts[1].y - pts[0].y) * (x - pts[0].x) / (pts[1].x - pts[0].x));
    var y2 = Math.round(pts[0].y + (pts[2].y - pts[0].y) * (x - pts[0].x) / (pts[2].x - pts[0].x));
    // Draw a vertical line
    for (var y = y1; y != y2; y += (y2 > y1) ? 1 : -1) {
      setpixel(ctx, x, y, col);
    }
  }

  // Draw from point 1 to point 2, drawing vertical scan lines.
  for (var x = pts[1].x; x < pts[2].x; x++) {
    // Interpolate to find y positions
    var y1 = Math.round(pts[0].y + (pts[2].y - pts[0].y) * (x - pts[0].x) / (pts[2].x - pts[0].x));
    var y2 = Math.round(pts[1].y + (pts[2].y - pts[1].y) * (x - pts[1].x) / (pts[2].x - pts[1].x));
    // Draw a vertical line
    for (var y = y1; y != y2; y += (y2 > y1) ? 1 : -1) {
      setpixel(ctx, x, y, col);
    }
  }
}

function setpixel(ctx, x, y, c) {
  ctx.fillStyle = c;
  ctx.fillRect(x, y, 1, 1);
}

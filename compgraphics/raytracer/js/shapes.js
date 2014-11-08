/**
 * Properties of a shape.
 * amb: { col: Color }
 * diff: { col: Color }
 * spec: { col: Color, stdev: Float }
 */
function Props(amb, diff, spec) {
  this.amb = amb;
  this.diff = diff;
  this.spec = spec;
}

function Sphere(c, r, props) {
  // Position
  this.c = c;
  // Radius
  this.r = r;
  // Properties
  this.props = props;
}

// Returns the parameter of the ray's intersection with this sphere, otherwise
// returns null.
Sphere.prototype.intersect = function(ray) {
  var a = ray.d.dot(ray.d);
  var b = ray.d.multiply(2).dot(ray.o.subtract(this.c));
  var c = ray.o.subtract(this.c).dot(ray.o.subtract(this.c)) - this.r * this.r;
  
  var d_sq = b*b -4*a*c;
  if (d_sq < 0) {
    return null;
  } else {
    var d = Math.sqrt(d_sq);
    var s1 = (-b + d) / (2*a);
    var s2 = (-b - d) / (2*a);
    var s = Math.min(s1, s2);
    return {
        param: s,
        norm: ray.calc(s).subtract(this.c).unit()
      };
  }
}

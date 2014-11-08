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

Sphere.prototype.randomPoint = function() {
  var r = Math.random() * this.r;
  var theta = Math.random() * Math.PI * 2;
  var phi = Math.acos(2*Math.random() - 1);
  return new Vector(
      this.c.x + r * Math.cos(theta) * Math.sin(phi),
      this.c.y + r * Math.sin(theta) * Math.sin(phi),
      this.c.z + r * Math.cos(phi)
      );
};


function Plane(p, n, props) {
  // Point on plane
  this.p = p;
  // Normal
  this.n = n.unit();
  // Properties
  this.props = props;
}

// Returns the parameter of the ray's intersection with this plane, otherwise
// returns null.
Plane.prototype.intersect = function(ray) {
  var denominator = this.n.dot(ray.d);
  if (Math.abs(denominator) > 1e-6) {
    return {
      param: this.p.subtract(ray.o).dot(this.n),
      norm: this.n
    };
  }
  return null;
}

// From lightgl.js

// Provides a simple 3D vector class. Vector operations can be done using member
// functions, which return new vectors, or static functions, which reuse
// existing vectors to avoid generating garbage.
function Vector(x, y) {
  this.x = x || 0;
  this.y = y || 0;
}

// ### Instance Methods
// The methods `add()`, `subtract()`, `multiply()`, and `divide()` can all
// take either a vector or a number as an argument.
Vector.prototype = {
  negative: function() {
    return new Vector(-this.x, -this.y);
  },
  add: function(v) {
    if (v instanceof Vector) return new Vector(this.x + v.x, this.y + v.y);
    else return new Vector(this.x + v, this.y + v);
  },
  subtract: function(v) {
    if (v instanceof Vector) return new Vector(this.x - v.x, this.y - v.y);
    else return new Vector(this.x - v, this.y - v);
  },
  multiply: function(v) {
    if (v instanceof Vector) return new Vector(this.x * v.x, this.y * v.y);
    else return new Vector(this.x * v, this.y * v);
  },
  divide: function(v) {
    if (v instanceof Vector) return new Vector(this.x / v.x, this.y / v.y);
    else return new Vector(this.x / v, this.y / v);
  },
  equals: function(v) {
    return this.x == v.x && this.y == v.y;
  },
  dot: function(v) {
    return this.x * v.x + this.y * v.y;
  },
  length: function() {
    return Math.sqrt(this.dot(this));
  },
  unit: function() {
    return this.divide(this.length());
  },
  min: function() {
    return Math.min(this.x, this.y);
  },
  max: function() {
    return Math.max(this.x, this.y);
  },
  toAngles: function() {
    return {
      phi: Math.asin(this.y / this.length())
    };
  },
  angleTo: function(a) {
    return Math.acos(this.dot(a) / (this.length() * a.length()));
  },
  toArray: function(n) {
    return [this.x, this.y].slice(0, n || 2);
  },
  clone: function() {
    return new Vector(this.x, this.y);
  },
  init: function(x, y) {
    this.x = x; this.y = y;
    return this;
  },
  // ADDED by Will
  reflect: function(norm) {
    return this.subtract(norm.multiply(this.dot(norm)*2));
  },
};

// ### Static Methods
// `Vector.randomDirection()` returns a vector with a length of 1 and a
// statistically uniform direction. `Vector.lerp()` performs linear
// interpolation between two vectors.
Vector.negative = function(a, b) {
  b.x = -a.x; b.y = -a.y; b.z = -a.z;
  return b;
};
Vector.add = function(a, b, c) {
  if (b instanceof Vector) { c.x = a.x + b.x; c.y = a.y + b.y; c.z = a.z + b.z; }
  else { c.x = a.x + b; c.y = a.y + b; c.z = a.z + b; }
  return c;
};
Vector.subtract = function(a, b, c) {
  if (b instanceof Vector) { c.x = a.x - b.x; c.y = a.y - b.y; c.z = a.z - b.z; }
  else { c.x = a.x - b; c.y = a.y - b; c.z = a.z - b; }
  return c;
};
Vector.multiply = function(a, b, c) {
  if (b instanceof Vector) { c.x = a.x * b.x; c.y = a.y * b.y; c.z = a.z * b.z; }
  else { c.x = a.x * b; c.y = a.y * b; c.z = a.z * b; }
  return c;
};
Vector.divide = function(a, b, c) {
  if (b instanceof Vector) { c.x = a.x / b.x; c.y = a.y / b.y; c.z = a.z / b.z; }
  else { c.x = a.x / b; c.y = a.y / b; c.z = a.z / b; }
  return c;
};
Vector.cross = function(a, b, c) {
  c.x = a.y * b.z - a.z * b.y;
  c.y = a.z * b.x - a.x * b.z;
  c.z = a.x * b.y - a.y * b.x;
  return c;
};
Vector.unit = function(a, b) {
  var length = a.length();
  b.x = a.x / length;
  b.y = a.y / length;
  b.z = a.z / length;
  return b;
};
Vector.fromAngles = function(theta, phi) {
  return new Vector(Math.cos(theta) * Math.cos(phi), Math.sin(phi), Math.sin(theta) * Math.cos(phi));
};
Vector.randomDirection = function() {
  return Vector.fromAngles(Math.random() * Math.PI * 2, Math.asin(Math.random() * 2 - 1));
};
Vector.min = function(a, b) {
  return new Vector(Math.min(a.x, b.x), Math.min(a.y, b.y), Math.min(a.z, b.z));
};
Vector.max = function(a, b) {
  return new Vector(Math.max(a.x, b.x), Math.max(a.y, b.y), Math.max(a.z, b.z));
};
Vector.lerp = function(a, b, fraction) {
  return b.subtract(a).multiply(fraction).add(a);
};
Vector.fromArray = function(a) {
  return new Vector(a[0], a[1], a[2]);
};
Vector.angleBetween = function(a, b) {
  return a.angleTo(b);
};

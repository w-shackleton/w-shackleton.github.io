function Colour(r, g, b) {
  this.r = r;
  this.g = g;
  this.b = b;
}

Colour.prototype = {
  add: function(other) {
    return new Colour(
        Math.min(this.r + other.r, 255),
        Math.min(this.g + other.g, 255),
        Math.min(this.b + other.b, 255));
  },
  mul: function(v) {
    if (v instanceof Colour) {
      return new Colour(
          this.r * v.r / 255,
          this.g * v.g / 255,
          this.b * v.b / 255);
    }
    return new Colour(
        this.r * v,
        this.g * v,
        this.b * v);
  },
};

WHITE = new Colour(255, 255, 255);
BLACK = new Colour(0, 0, 0);

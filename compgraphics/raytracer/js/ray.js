function Ray(o, d) {
  this.o = o; // Origin
  this.d = d; // Direction
}

Ray.prototype.calc = function(param) {
  return this.o.add(this.d.multiply(param));
};

/**
 * Gives a sample from a normal distribution
 */
function norm_sample(stdev) {
  return stdev * 2 * (
      Math.random() +
      Math.random() +
      Math.random() +
      Math.random() +
      Math.random() +
      Math.random() +
      Math.random() +
      Math.random() +
      Math.random() +
      Math.random() - 5);
}

function deviate(dir, stdev) {
  if (stdev == 0) {
    return dir;
  }

  // Calculate two norms mutually perpendicular to dir
  var norm1 = dir.cross(dir.add(4));
  if (norm1.x == 0 && norm1.y == 0 && norm1.z == 0) {
    norm1 = dir.cross(dir.add(new Vector(1, 0, 0)));
  }
  norm1 = norm1.unit();
  var norm2 = dir.cross(norm1).unit();

  return dir.add(
      norm1.multiply(norm_sample(stdev))).add(
      norm2.multiply(norm_sample(stdev)));
}

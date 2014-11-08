/**
 * Constructs a scene
 * objs: list of shape objects
 * camera: vector of the camera
 * viewport: object of the corners of the viewport (tl, tr, bl, br)
 */
function Scene(objs, camera, viewport) {
  this.objs = objs;
  this.camera = camera;
  this.viewport = viewport;
  this.bg = new Colour(0, 0, 0);
}

/**
 * Traces a ray. x and y are between 0 and 1.
 */
Scene.prototype.trace = function(x, y) {
  var left = Vector.lerp(this.viewport.tl, this.viewport.bl, y);
  var right = Vector.lerp(this.viewport.tr, this.viewport.br, y);
  var top = Vector.lerp(this.viewport.tl, this.viewport.tr, x);
  var bottom = Vector.lerp(this.viewport.bl, this.viewport.br, x);

  var pos1 = Vector.lerp(left, right, x);
  var pos2 = Vector.lerp(top, bottom, y);
  var pos = pos1;

  var ray = new Ray(this.camera, pos.subtract(this.camera).unit());
  return this.traceRay(ray, 5);
}

/**
 * Traces a ray and returns the colour value from that ray.
 */
Scene.prototype.traceRay = function(ray, iters) {
  var collided = this.objs.map(function(obj) {
    var data = obj.intersect(ray);
    if (data === null) {
      return null;
    }
    return { param: data.param, norm: data.norm, obj: obj };
  }).filter(function(obj) {
    return obj !== null && obj.param > 0;
  }).reduce(function(prev, curr) {
    return curr.param < prev.param ? curr : prev;
  }, { param: Infinity, obj: null });

  if (collided.obj === null) {
    return { col: this.bg };
  }

  var obj = collided.obj;
  var param = collided.param;
  var norm = collided.norm;
  if (iters == 0) {
    return { col: obj.props.amb.col };
  }

  // We need to iterate specular reflection

  var reflection = ray.d.reflect(norm);

  var new_ray = new Ray(ray.calc(param), deviate(reflection, obj.props.spec.stdev));

  var specular = this.traceRay(new_ray, iters-1);
  return { col:
    obj.props.amb.col.add(obj.props.spec.col.mul(specular.col)),
  };
}

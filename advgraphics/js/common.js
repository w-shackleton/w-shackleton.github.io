var mvMatrix = mat4.create();
var mvMatrixStack = [];
var pMatrix = mat4.create();

function setMatrixUniforms() {
  gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
  gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
}

function mvPushMatrix() {
  var copy = mat4.create();
  mat4.copy(copy, mvMatrix);
  mvMatrixStack.push(copy);
}

function mvPopMatrix() {
  if (mvMatrixStack.length == 0) {
    throw "Invalid popMatrix!";
  }
  mvMatrix = mvMatrixStack.pop();
}

function getMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  };
}

var rotationX = 0, rotationY = 0;

function setupCanvasMouse(canvas) {
  var start;
  var down = false;
  canvas.addEventListener('mousedown', function(evt) {
    start = getMousePos(canvas, evt);
    down = true;
  });
  canvas.addEventListener('mouseup', function(evt) {
    down = false;
  });
  canvas.addEventListener('mousemove', function(evt) {
    if (down) {
      var mousePos = getMousePos(canvas, evt);
      var diffX = mousePos.x - start.x;
      var diffY = mousePos.y - start.y;
      rotationX += diffX / 100;
      rotationY += diffY / 100;
      start = mousePos;
      drawScene();
    }
  });
}

function getShader(gl, id) {
  var shaderScript = document.getElementById(id);
  if (!shaderScript) {
    return null;
  }

  var str = "";
  var k = shaderScript.firstChild;
  while (k) {
    if (k.nodeType == 3)
      str += k.textContent;
    k = k.nextSibling;
  }

  var shader;
  if (shaderScript.type == "x-shader/x-fragment") {
    shader = gl.createShader(gl.FRAGMENT_SHADER);
  } else if (shaderScript.type == "x-shader/x-vertex") {
    shader = gl.createShader(gl.VERTEX_SHADER);
  } else {
    return null;
  }

  gl.shaderSource(shader, str);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert(gl.getShaderInfoLog(shader));
    return null;
  }

  return shader;
}

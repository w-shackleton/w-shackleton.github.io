// I followed this WebGL tutorial: http://learningwebgl.com/blog/?page_id=1217

function webGLStart() {
  var canvas = document.getElementById("canvas");
  initGL(canvas);
  initShaders();
  initBuffers();

  setupCanvasMouse(canvas);

  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.enable(gl.DEPTH_TEST);

  drawScene();

  setInterval(function() {
    tick();
    drawScene();
  }, 10);
}

var gl;
function initGL(canvas) {
  try {
    gl = canvas.getContext("experimental-webgl");
    gl.viewportWidth = canvas.width;
    gl.viewportHeight = canvas.height;
  } catch(e) {
  }
  if (!gl) {
    alert("Could not initialise WebGL");
  }
}

var shaderProgram;
function initShaders() {
  var fragmentShader = getShader(gl, "shader-fs");
  var vertexShader = getShader(gl, "shader-vs");

  shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert("Could not initialise shaders");
  }

  gl.useProgram(shaderProgram);
  shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
  gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

  shaderProgram.vertexTimeUniform = gl.getUniformLocation(shaderProgram, "uVertexTime");

  shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
  shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
}

function initBuffers() {
  vertexPositionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer);
  // Feed in a grid normal to z, wrap it into a torus in the vertex shader. We are using GL_TRIANGLES for ease (yes this uses more GPU memory but oh well).
  var primaries = 500;
  var secondaries = 100;
  var vertices = [];
  for (var p = 0; p < primaries; p++) {
    for (var s = 0; s < secondaries; s++) {
      var x1 = p / primaries - 0.5;
      var y1 = s / secondaries - 0.5;
      var x2 = (p+1) / primaries - 0.5;
      var y2 = s / secondaries - 0.5;
      var x3 = p / primaries - 0.5;
      var y3 = (s+1) / secondaries - 0.5;
      vertices.push.apply(vertices, [x1, y1, 0]);
      vertices.push.apply(vertices, [x2, y2, 0]);
      vertices.push.apply(vertices, [x3, y3, 0]);

      // 2nd triangle in rectangle
      x1 = (p+1) / primaries - 0.5;
      y1 = s / secondaries - 0.5;
      x2 = (p+1) / primaries - 0.5;
      y2 = (s+1) / secondaries - 0.5;
      x3 = p / primaries - 0.5;
      y3 = (s+1) / secondaries - 0.5;
      vertices.push.apply(vertices, [x1, y1, 0]);
      vertices.push.apply(vertices, [x2, y2, 0]);
      vertices.push.apply(vertices, [x3, y3, 0]);
    }
  }
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

  vertexPositionBuffer.itemSize = 3;
  vertexPositionBuffer.numItems = primaries * secondaries * 6;

  // We just use positions - sneaky shader stuff happens then.

  // Time component.
  vertexTimeBuffer = gl.createBuffer();
  vertexTimeBuffer.itemSize = 1;
  vertexTimeBuffer.numItems = 1;
}

function drawScene() {
  gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  mat4.perspective(pMatrix, 45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0);
  mat4.identity(mvMatrix);
  mat4.translate(mvMatrix, mvMatrix, [0.0, 0.0, -7.0]);

  mvPushMatrix();

  mat4.scale(mvMatrix, mvMatrix, [4,4,4]);

  mat4.rotate(mvMatrix, mvMatrix, rotationX, [0,1,0]);
  mat4.rotate(mvMatrix, mvMatrix, rotationY, [1,0,0]);

  gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer);
  gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, vertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

  setMatrixUniforms();
  gl.drawArrays(gl.TRIANGLES, 0, vertexPositionBuffer.numItems);

  mvPopMatrix();
}

time = 0.0;

function tick() {
  gl.uniform1f(shaderProgram.vertexTimeUniform, time);

  time += 0.1;
}

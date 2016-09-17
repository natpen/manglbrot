const regl = require('regl')();
const NUM_AXES_STEPS = 100;

const points = function() {
  var points = [];
  const max = 200;
  for (var row = -1.0; row <= 1.0; row += 2.0 / NUM_AXES_STEPS) {
    for (var col = -1.0; col <= 1.0; col += 2.0 / NUM_AXES_STEPS) {
      var c_re = col * 2.0;
      var c_im = row * 2.0;
      var x = 0, y = 0;
      var iteration = 0;
      while (x*x+y*y <= 4.0 && iteration < max) {
          var x_new = x*x - y*y + c_re;
          y = 2*x*y + c_im;
          x = x_new;
          iteration++;
      }
      if (iteration < max) {
        points.push({ position: [col, row], color: [1, 1, 1, 1] });
      } else {
        points.push({ position: [col, row], color: [0, 0, 0, 1] });
      }
    }
  }
  return points;
}();;

const draw = regl({
  frag: `
    precision mediump float;
    uniform vec4 color;
    void main() {
      gl_FragColor = color;
    }`,

  vert: `
    precision mediump float;
    uniform vec2 position;
    void main() {
      gl_PointSize = 5.0;
      gl_Position = vec4(position, 0, 1);
    }`,

  uniforms: {
    position: regl.prop('position'),
    color: regl.prop('color')
  },

  depth: {
    enable: false
  },

  count: NUM_AXES_STEPS,

  primitive: 'points'
});

regl.frame(function () {
  regl.clear({
    color: [0, 0, 0, 1]
  });

  draw(points);
});
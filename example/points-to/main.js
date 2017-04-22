(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (factory());
}(this, (function () { 'use strict';

(function () {
    'use strict';

    if (!Date.now) Date.now = function () {
        return new Date().getTime();
    };

    var vendors = ['webkit', 'moz'];
    for (var i = 0; i < vendors.length && !window.requestAnimationFrame; ++i) {
        var vp = vendors[i];
        window.requestAnimationFrame = window[vp + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vp + 'CancelAnimationFrame'] || window[vp + 'CancelRequestAnimationFrame'];
    }
    if (/iP(ad|hone|od).*OS 6/.test(window.navigator.userAgent) // iOS6 is buggy
    || !window.requestAnimationFrame || !window.cancelAnimationFrame) {
        var lastTime = 0;
        window.requestAnimationFrame = function (callback) {
            var now = Date.now();
            var nextTime = Math.max(lastTime + 16, now);
            return setTimeout(function () {
                callback(lastTime = nextTime);
            }, nextTime - now);
        };
        window.cancelAnimationFrame = clearTimeout;
    }
})();

/**
 * dance motion, spin around.
 *
 * @param {points}
 * @param {data}
 *      data rule example:
 *      { angle : 0, r : 5 , step : Math.PI / 50 }
 */
var dance$1 = function (points, data) {
    var pre = this.copyPoints,
        theta = data.angle,
        r = data.r;

    var R = [[Math.cos(theta), -Math.sin(theta)], [Math.sin(theta), Math.cos(theta)]];
    points[0] = pre[0] + R[0][0] * r;
    points[1] = pre[1] + R[1][0] * r;
    points[2] = pre[2] + R[0][0] * r;
    points[3] = pre[3] + R[1][0] * r;
    points[4] = pre[4] + R[0][0] * r;
    points[5] = pre[5] + R[1][0] * r;
    points[6] = pre[6] + R[0][0] * r;
    points[7] = pre[7] + R[1][0] * r;

    data.angle += data.step;
};

/**
 * move motion.
 *
 * @param {points}
 * @param {data}
 *      data rule example:
 *      [1, 0.2, -3, 0.7, 0.5, 0.3, -1, 1]
 */
var move = function (points, data) {
    points.forEach(function (item, index) {
        points[index] += data[index];
    });
};

/**
 * rotate motion.
 *
 * @param {points}
 * @param {data}
 *      data rule example:
 *      Math.PI/100
 */

function _rotate(x1, y1, x2, y2, theta, index, points) {
    var v = { x: x1 - x2, y: y1 - y2 };
    var R = [[Math.cos(theta), -Math.sin(theta)], [Math.sin(theta), Math.cos(theta)]];

    points[index] = x2 + R[0][0] * v.x + R[0][1] * v.y;
    points[index + 1] = y2 + R[1][0] * v.x + R[1][1] * v.y;
}

function rotate(points, angle) {
    var centerX = (points[0] + points[6]) / 2;
    var centerY = (points[1] + points[7]) / 2;
    _rotate(points[0], points[1], centerX, centerY, angle, 0, points);
    _rotate(points[2], points[3], centerX, centerY, angle, 2, points);
    _rotate(points[4], points[5], centerX, centerY, angle, 4, points);
    _rotate(points[6], points[7], centerX, centerY, angle, 6, points);
}

function n(x, y) {
    var sum = x * x + y * y;
    if (sum === 0) return [0, 0];
    var len = Math.sqrt(sum);
    return [x / len, y / len];
}

function sl(x, y) {
    return x * x + y * y;
}

var vector2 = {
    n: n,
    sl: sl
};

/**
 * close or open path motion.
 *
 * @param {points}
 */

function open(points) {
    var v = vector2.n(points[0] - points[6], points[1] - points[7]);

    points[0] += v[0];
    points[1] += v[1];

    points[6] -= v[0];
    points[7] -= v[1];
}

function close(points) {
    var v = vector2.n(points[0] - points[6], points[1] - points[7]);

    points[0] -= v[0];
    points[1] -= v[1];

    points[6] += v[0];
    points[7] += v[1];
}

function auto(points) {}

var path = {
    close: close,
    open: open,
    auto: auto
};

/**
 * to motion.
 *
 * @param {points}
 * @param {data}
 *      data rule example:
 *      [100,200, 150, 333, 200,11, 1, 1]
 */
function to(points, target) {
    var va1 = [points[2] - points[0], points[3] - points[1]];
    var va2 = [points[4] - points[2], points[5] - points[3]];
    var va3 = [points[6] - points[4], points[7] - points[5]];

    var vb1 = [target[2] - target[0], target[3] - target[1]];
    var vb2 = [target[4] - target[2], target[5] - target[3]];
    var vb3 = [target[6] - target[4], target[7] - target[5]];

    var v1 = vector2.n(vb1[0] - va1[0], vb1[1] - va1[1]);
    points[0] -= v1[0];
    points[1] -= v1[1];

    var v2 = vector2.n(vb2[0] - va2[0], vb2[1] - va2[1]);
    points[4] += v2[0];
    points[5] += v2[1];

    var v3 = vector2.n(vb3[0] - va3[0], vb3[1] - va3[1]);
    points[6] += v3[0];
    points[7] += v3[1];
}

function line(arr) {

    arr[2] += arr[2] > arr[0] ? -1 : 1;
    arr[3] += arr[3] > arr[1] ? -1 : 1;
    arr[4] += arr[4] > arr[6] ? -1 : 1;
    arr[5] += arr[5] > arr[7] ? -1 : 1;
}

function circle(points, data) {
    var R = [[Math.cos(data.angle), -Math.sin(data.angle)], [Math.sin(data.angle), Math.cos(data.angle)]];

    this.data.angle += data.step;

    points[0] = points[0] + R[0][0];
    points[1] = points[1] + R[1][0];
    points[6] = points[6] + R[0][0];
    points[7] = points[7] + R[1][0];
}

function sliceBezier(p1, cp1, cp2, p2, t) {
    var x1 = p1.x,
        y1 = p1.y,
        x2 = cp1.x,
        y2 = cp1.y,
        x3 = cp2.x,
        y3 = cp2.y,
        x4 = p2.x,
        y4 = p2.y;

    var x12 = (x2 - x1) * t + x1;
    var y12 = (y2 - y1) * t + y1;

    var x23 = (x3 - x2) * t + x2;
    var y23 = (y3 - y2) * t + y2;

    var x34 = (x4 - x3) * t + x3;
    var y34 = (y4 - y3) * t + y3;

    var x123 = (x23 - x12) * t + x12;
    var y123 = (y23 - y12) * t + y12;

    var x234 = (x34 - x23) * t + x23;
    var y234 = (y34 - y23) * t + y23;

    var x1234 = (x234 - x123) * t + x123;
    var y1234 = (y234 - y123) * t + y123;

    return [x1, y1, x12, y12, x123, y123, x1234, y1234];
}

var expand = function (points, data) {
    data.value -= data.step;
    if (data.value < 0) data.value = 0;
    var part1OfBezier = sliceBezier({ x: this.copyPoints[0], y: this.copyPoints[1] }, { x: this.copyPoints[2], y: this.copyPoints[3] }, { x: this.copyPoints[4], y: this.copyPoints[5] }, { x: this.copyPoints[6], y: this.copyPoints[7] }, data.value);

    points.forEach(function (value, index) {
        points[index] = part1OfBezier[index];
    });
};

// from https://github.com/processing/p5.js/blob/master/src/math/noise.js

//////////////////////////////////////////////////////////////

// http://mrl.nyu.edu/~perlin/noise/
// Adapting from PApplet.java
// which was adapted from toxi
// which was adapted from the german demo group farbrausch
// as used in their demo "art": http://www.farb-rausch.de/fr010src.zip

// someday we might consider using "improved noise"
// http://mrl.nyu.edu/~perlin/paper445.pdf
// See: https://github.com/shiffman/The-Nature-of-Code-Examples-p5.js/
//      blob/master/introduction/Noise1D/noise.js

/**
 * @module Math
 * @submodule Noise
 * @for p5
 * @requires core
 */

var p5 = {};

var PERLIN_YWRAPB = 4;
var PERLIN_YWRAP = 1 << PERLIN_YWRAPB;
var PERLIN_ZWRAPB = 8;
var PERLIN_ZWRAP = 1 << PERLIN_ZWRAPB;
var PERLIN_SIZE = 4095;

var perlin_octaves = 4; // default to medium smooth
var perlin_amp_falloff = 0.5; // 50% reduction/octave

var scaled_cosine = function scaled_cosine(i) {
    return 0.5 * (1.0 - Math.cos(i * Math.PI));
};

var perlin; // will be initialized lazily by noise() or noiseSeed()


/**
 * Returns the Perlin noise value at specified coordinates. Perlin noise is
 * a random sequence generator producing a more natural ordered, harmonic
 * succession of numbers compared to the standard <b>random()</b> function.
 * It was invented by Ken Perlin in the 1980s and been used since in
 * graphical applications to produce procedural textures, natural motion,
 * shapes, terrains etc.<br /><br /> The main difference to the
 * <b>random()</b> function is that Perlin noise is defined in an infinite
 * n-dimensional space where each pair of coordinates corresponds to a
 * fixed semi-random value (fixed only for the lifespan of the program; see
 * the noiseSeed() function). p5.js can compute 1D, 2D and 3D noise,
 * depending on the number of coordinates given. The resulting value will
 * always be between 0.0 and 1.0. The noise value can be animated by moving
 * through the noise space as demonstrated in the example above. The 2nd
 * and 3rd dimension can also be interpreted as time.<br /><br />The actual
 * noise is structured similar to an audio signal, in respect to the
 * function's use of frequencies. Similar to the concept of harmonics in
 * physics, perlin noise is computed over several octaves which are added
 * together for the final result. <br /><br />Another way to adjust the
 * character of the resulting sequence is the scale of the input
 * coordinates. As the function works within an infinite space the value of
 * the coordinates doesn't matter as such, only the distance between
 * successive coordinates does (eg. when using <b>noise()</b> within a
 * loop). As a general rule the smaller the difference between coordinates,
 * the smoother the resulting noise sequence will be. Steps of 0.005-0.03
 * work best for most applications, but this will differ depending on use.
 *
 *
 * @method noise
 * @param  {Number} x   x-coordinate in noise space
 * @param  {Number} y   y-coordinate in noise space
 * @param  {Number} z   z-coordinate in noise space
 * @return {Number}     Perlin noise value (between 0 and 1) at specified
 *                      coordinates
 * @example
 * <div>
 * <code>var xoff = 0.0;
 *
 * function draw() {
 *   background(204);
 *   xoff = xoff + .01;
 *   var n = noise(xoff) * width;
 *   line(n, 0, n, height);
 * }
 * </code>
 * </div>
 * <div>
 * <code>var noiseScale=0.02;
 *
 * function draw() {
 *   background(0);
 *   for (var x=0; x < width; x++) {
 *     var noiseVal = noise((mouseX+x)*noiseScale, mouseY*noiseScale);
 *     stroke(noiseVal*255);
 *     line(x, mouseY+noiseVal*80, x, height);
 *   }
 * }
 * </code>
 * </div>
 *
 * @alt
 * vertical line moves left to right with updating noise values.
 * horizontal wave pattern effected by mouse x-position & updating noise values.
 *
 */

p5.noise = function (x, y, z) {
    y = y || 0;
    z = z || 0;

    if (perlin == null) {
        perlin = new Array(PERLIN_SIZE + 1);
        for (var i = 0; i < PERLIN_SIZE + 1; i++) {
            perlin[i] = Math.random();
        }
    }

    if (x < 0) {
        x = -x;
    }
    if (y < 0) {
        y = -y;
    }
    if (z < 0) {
        z = -z;
    }

    var xi = Math.floor(x),
        yi = Math.floor(y),
        zi = Math.floor(z);
    var xf = x - xi;
    var yf = y - yi;
    var zf = z - zi;
    var rxf, ryf;

    var r = 0;
    var ampl = 0.5;

    var n1, n2, n3;

    for (var o = 0; o < perlin_octaves; o++) {
        var of = xi + (yi << PERLIN_YWRAPB) + (zi << PERLIN_ZWRAPB);

        rxf = scaled_cosine(xf);
        ryf = scaled_cosine(yf);

        n1 = perlin[of & PERLIN_SIZE];
        n1 += rxf * (perlin[of + 1 & PERLIN_SIZE] - n1);
        n2 = perlin[of + PERLIN_YWRAP & PERLIN_SIZE];
        n2 += rxf * (perlin[of + PERLIN_YWRAP + 1 & PERLIN_SIZE] - n2);
        n1 += ryf * (n2 - n1);

        of += PERLIN_ZWRAP;
        n2 = perlin[of & PERLIN_SIZE];
        n2 += rxf * (perlin[of + 1 & PERLIN_SIZE] - n2);
        n3 = perlin[of + PERLIN_YWRAP & PERLIN_SIZE];
        n3 += rxf * (perlin[of + PERLIN_YWRAP + 1 & PERLIN_SIZE] - n3);
        n2 += ryf * (n3 - n2);

        n1 += scaled_cosine(zf) * (n2 - n1);

        r += n1 * ampl;
        ampl *= perlin_amp_falloff;
        xi <<= 1;
        xf *= 2;
        yi <<= 1;
        yf *= 2;
        zi <<= 1;
        zf *= 2;

        if (xf >= 1.0) {
            xi++;xf--;
        }
        if (yf >= 1.0) {
            yi++;yf--;
        }
        if (zf >= 1.0) {
            zi++;zf--;
        }
    }
    return r;
};

/**
 *
 * Adjusts the character and level of detail produced by the Perlin noise
 * function. Similar to harmonics in physics, noise is computed over
 * several octaves. Lower octaves contribute more to the output signal and
 * as such define the overall intensity of the noise, whereas higher octaves
 * create finer grained details in the noise sequence.
 * <br><br>
 * By default, noise is computed over 4 octaves with each octave contributing
 * exactly half than its predecessor, starting at 50% strength for the 1st
 * octave. This falloff amount can be changed by adding an additional function
 * parameter. Eg. a falloff factor of 0.75 means each octave will now have
 * 75% impact (25% less) of the previous lower octave. Any value between
 * 0.0 and 1.0 is valid, however note that values greater than 0.5 might
 * result in greater than 1.0 values returned by <b>noise()</b>.
 * <br><br>
 * By changing these parameters, the signal created by the <b>noise()</b>
 * function can be adapted to fit very specific needs and characteristics.
 *
 * @method noiseDetail
 * @param {Number} lod number of octaves to be used by the noise
 * @param {Number} falloff falloff factor for each octave
 * @example
 * <div>
 * <code>
 *
 * var noiseVal;
 * var noiseScale=0.02;
 *
 * function setup() {
 *   createCanvas(100,100);
 * }
 *
 * function draw() {
 *   background(0);
 *   for (var y = 0; y < height; y++) {
 *     for (var x = 0; x < width/2; x++) {
 *       noiseDetail(2,0.2);
 *       noiseVal = noise((mouseX+x) * noiseScale,
 *                        (mouseY+y) * noiseScale);
 *       stroke(noiseVal*255);
 *       point(x,y);
 *       noiseDetail(8,0.65);
 *       noiseVal = noise((mouseX + x + width/2) * noiseScale,
 *                        (mouseY + y) * noiseScale);
 *       stroke(noiseVal*255);
 *       point(x + width/2, y);
 *     }
 *   }
 * }
 * </code>
 * </div>
 *
 * @alt
 * 2 vertical grey smokey patterns affected my mouse x-position and noise.
 *
 */
p5.noiseDetail = function (lod, falloff) {
    if (lod > 0) {
        perlin_octaves = lod;
    }
    if (falloff > 0) {
        perlin_amp_falloff = falloff;
    }
};

/**
 * Sets the seed value for <b>noise()</b>. By default, <b>noise()</b>
 * produces different results each time the program is run. Set the
 * <b>value</b> parameter to a constant to return the same pseudo-random
 * numbers each time the software is run.
 *
 * @method noiseSeed
 * @param {Number} seed   the seed value
 * @example
 * <div>
 * <code>var xoff = 0.0;
 *
 * function setup() {
 *   noiseSeed(99);
 *   stroke(0, 10);
 * }
 *
 * function draw() {
 *   xoff = xoff + .01;
 *   var n = noise(xoff) * width;
 *   line(n, 0, n, height);
 * }
 * </code>
 * </div>
 *
 * @alt
 * vertical grey lines drawing in pattern affected by noise.
 *
 */
p5.noiseSeed = function (seed) {
    // Linear Congruential Generator
    // Variant of a Lehman Generator
    var lcg = function () {
        // Set to values from http://en.wikipedia.org/wiki/Numerical_Recipes
        // m is basically chosen to be large (as it is the max period)
        // and for its relationships to a and c
        var m = 4294967296,

        // a - 1 should be divisible by m's prime factors
        a = 1664525,

        // c and m should be co-prime
        c = 1013904223,
            seed,
            z;
        return {
            setSeed: function setSeed(val) {
                // pick a random seed if val is undefined or null
                // the >>> 0 casts the seed to an unsigned 32-bit integer
                z = seed = (val == null ? Math.random() * m : val) >>> 0;
            },
            getSeed: function getSeed() {
                return seed;
            },
            rand: function rand() {
                // define the recurrence relationship
                z = (a * z + c) % m;
                // return a float in [0, 1)
                // if z = m then z / m = 0 therefore (z % m) / m < 1 always
                return z / m;
            }
        };
    }();

    lcg.setSeed(seed);
    perlin = new Array(PERLIN_SIZE + 1);
    for (var i = 0; i < PERLIN_SIZE + 1; i++) {
        perlin[i] = lcg.rand();
    }
};

/**
 * noise motion.
 *
 * @param {points}
 * @param {data}
 *      data rule example:
 *      { value : 0, step : 0.005 ,width : 600, height : 400}
 */
var noise = function (points, data) {
    data.value += data.step;

    points[0] = data.width * p5.noise(data.value + 15);
    points[1] = data.height * p5.noise(data.value + 25);
    points[2] = data.width * p5.noise(data.value + 35);
    points[3] = data.height * p5.noise(data.value + 45);
    points[4] = data.width * p5.noise(data.value + 55);
    points[5] = data.height * p5.noise(data.value + 65);
    points[6] = data.width * p5.noise(data.value + 75);
    points[7] = data.height * p5.noise(data.value + 85);
};

var motion$1 = {
    dance: dance$1,
    move: move,
    rotate: rotate,
    to: to,
    line: line,
    circle: circle,
    close: path.close,
    open: path.open,
    expand: expand,
    noise: noise
};

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();









var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};











var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

var Curve$1 = function () {
    function Curve(option) {
        classCallCheck(this, Curve);

        this.points = option.points || [0, 0, 0, 0, 0, 0, 0, 0];
        this.color = option.color || 'black';
        this.x = option.x || 0;
        this.y = option.y || 0;
        this.vision = option.vision || [];
        this.visionMax = 720;
        this.visionInterval = option.visionInterval || 10;

        this._preDate = Date.now();
        this._now = new Date();

        this.data = option.data;

        this._noop = function () {};
        this._ease = function (value) {
            return value;
        };
        this._targetPoints = null;

        this.copyPoints = this.points.slice(0);
        this.motion = option.motion || this._noop;

        this.visionAlpha = option.visionAlpha === void 0 ? 0.2 : option.visionAlpha;

        if (option.initVision === void 0 || option.initVision) {
            this._initVision(option.visionCount || 80);
        }
    }

    createClass(Curve, [{
        key: '_initVision',
        value: function _initVision() {
            var i = 0;
            for (; i < 80; i++) {
                this.tick(true);
            }
        }
    }, {
        key: 'tick',
        value: function tick(tickSelf) {
            this._now = Date.now();
            if (this._now - this._preDate > this.visionInterval || tickSelf) {

                this.vision.push.apply(this.vision, this.points);
                this.vision.push(this.color);
                if (tickSelf) {
                    console.log(JSON.stringify(this.vision));
                }
                if (this.vision.length > this.visionMax) {
                    this.vision.splice(0, 9);
                }
                this._preDate = this._now;
            }

            if (!this.pauseMotion) {
                this.motion.call(this, this.points, this.data);
            }

            if (this._targetPoints) {
                this._pointsTo();
            }
        }
    }, {
        key: 'pause',
        value: function pause() {
            this.pauseMotion = true;
        }
    }, {
        key: 'play',
        value: function play() {
            this.pauseMotion = false;
        }
    }, {
        key: 'draw',
        value: function draw(ctx) {
            this.tick();
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.globalAlpha = 1;
            ctx.strokeStyle = this.color;
            var points = this.points;
            ctx.beginPath();
            ctx.moveTo.call(ctx, points[0], points[1]);
            ctx.bezierCurveTo.call(ctx, points[2], points[3], points[4], points[5], points[6], points[7]);
            ctx.stroke();

            var vision = this.vision;

            var i = 0,
                len = vision.length;
            for (; i < len; i += 9) {
                ctx.globalAlpha = i / this.visionMax * this.visionAlpha;
                ctx.strokeStyle = vision[i + 8];
                ctx.beginPath();
                ctx.moveTo.call(ctx, vision[i], vision[i + 1]);
                ctx.bezierCurveTo.call(ctx, vision[i + 2], vision[i + 3], vision[i + 4], vision[i + 5], vision[i + 6], vision[i + 7]);
                ctx.stroke();
            }
            ctx.restore();
        }
    }, {
        key: 'pointsTo',
        value: function pointsTo(points, time, option) {
            this.pause();
            var ps = this.points;
            this._targetPoints = points;
            this._pto = option;
            this._ptStart = option.start || this._noop;
            this._ptProgress = option.progress || this._noop;
            this._ptEnd = option.end || this._noop;
            this._ptEase = option.ease || this._ease;
            this._ptTime = time;
            this._ptStartTime = Date.now();
            this._ptCopyPoints = ps.slice(0);

            this._ptDistance = [points[0] - ps[0], points[1] - ps[1], points[2] - ps[2], points[3] - ps[3], points[4] - ps[4], points[5] - ps[5], points[6] - ps[6], points[7] - ps[7]];

            this._ptStart.call(this, 0);
        }
    }, {
        key: 'translatePoints',
        value: function translatePoints(xy, time, option) {

            xy = Object.assign({ x: 0, y: 0 }, xy);
            var ps = this.points;
            this.pointsTo([ps[0] + xy.x, ps[1] + xy.y, ps[2] + xy.x, ps[3] + xy.y, ps[4] + xy.x, ps[5] + xy.y, ps[6] + xy.x, ps[7] + xy.y], time, option);
        }
    }, {
        key: '_pointsTo',
        value: function _pointsTo() {
            var _this = this;

            var ps = this.points;
            var dt = Date.now() - this._ptStartTime;
            if (dt < this._ptTime) {
                var progress = dt / this._ptTime;
                ps.forEach(function (v, i) {
                    ps[i] = _this._ptCopyPoints[i] + _this._ptDistance[i] * _this._ptEase(progress);
                });
                this._ptProgress.call(this, progress);
            } else {
                ps = this._targetPoints.slice(0);
                this._ptEnd.call(this, 1);
                this._targetPoints = null;
            }
        }
    }, {
        key: 'colorTo',
        value: function colorTo() {}
    }, {
        key: 'clone',
        value: function clone() {}
    }]);
    return Curve;
}();

var Group = function () {
    function Group() {
        classCallCheck(this, Group);

        this.children = [];
    }

    createClass(Group, [{
        key: "add",
        value: function add(line) {
            this.children.push(line);
        }
    }, {
        key: "remove",
        value: function remove(line) {
            var i = 0,
                len = this.children.length;
            for (; i < len; i++) {

                if (line === this.children[i]) {

                    this.children.splice(i, 1);
                    break;
                }
            }
        }
    }, {
        key: "draw",
        value: function draw(ctx) {
            this.children.forEach(function (child) {
                child.draw(ctx);
            });
        }
    }]);
    return Group;
}();

var Stage$1 = function (_Group) {
    inherits(Stage, _Group);

    function Stage(width, height, renderTo) {
        classCallCheck(this, Stage);

        var _this = possibleConstructorReturn(this, (Stage.__proto__ || Object.getPrototypeOf(Stage)).call(this));

        if (arguments.length === 1) {
            _this.canvas = width;
            _this.ctx = _this.canvas.getContext('2d');
            _this.width = _this.canvas.width;
            _this.height = _this.canvas.height;
        } else if (arguments.length === 3) {
            _this.canvas = document.createElement('canvas');
            _this.canvas.width = width;
            _this.canvas.height = height;
            _this.width = width;
            _this.height = height;
            _this.ctx = _this.canvas.getContext('2d');
            document.querySelector(renderTo).appendChild(_this.canvas);
        }
        return _this;
    }

    createClass(Stage, [{
        key: 'update',
        value: function update() {
            var _this2 = this;

            this.ctx.clearRect(0, 0, this.width, this.height);
            this.children.forEach(function (child) {
                child.draw(_this2.ctx);
            });
        }
    }, {
        key: 'addExistLine',
        value: function addExistLine(process) {}
    }, {
        key: 'sameAs',
        value: function sameAs(index) {}
    }]);
    return Stage;
}(Group);

var wordData = {
    'c': [[70, 70, 12, 76, 12, 123, 70, 128]],
    'u': [[25, 68, 23, 140, 80, 140, 74, 100], [73, 62, 72, 90, 75, 110, 93, 134]],
    'r': [[21, 62, 21, 62, 21, 128, 21, 128], [21, 128, 17, 96, 17, 68, 65, 60]],
    'v': [[12, 58, 41, 132, 61, 132, 96, 58]],
    'e': [[44, 104, 112, 52, -20, 82, 77, 136]],
    'j': [[52, 48, 53, 48, 54, 49, 52, 48], [8, 175, 24, 204, 60, 197, 56, 74]], 's': [[81, 72, 17, 42, 105, 145, 41, 120]],
    'l': [[77, 27, 30, 114, 36, 126, 57, 126]],
    'i': [[56, 71, 56, 72, 59, 70, 56, 73], [47, 93, 59, 81, 47, 121, 59, 111]]
};

var Word = function (_Group) {
    inherits(Word, _Group);

    function Word(word, option) {
        classCallCheck(this, Word);

        var _this = possibleConstructorReturn(this, (Word.__proto__ || Object.getPrototypeOf(Word)).call(this));

        option = Object.assign({
            x: 0, y: 0, color: 'black'
        }, option);

        _this.x = option.x;
        _this.y = option.y;
        _this.color = option.color;
        _this.word = word;
        _this.data = option.data;
        _this.motion = option.motion;

        _this.points = wordData[word];

        _this._init();
        return _this;
    }

    createClass(Word, [{
        key: '_init',
        value: function _init() {
            var _this2 = this;

            this.points.forEach(function (item) {

                _this2.add(new Curve$1({
                    x: _this2.x,
                    y: _this2.y,
                    points: item,
                    color: _this2.color,
                    data: _this2.data,
                    motion: _this2.motion
                }));
            });
        }
    }]);
    return Word;
}(Group);

var cache = {};

var cssColors = {
    aliceblue: 0xF0F8FF,
    antiquewhite: 0xFAEBD7,
    aqua: 0x00FFFF,
    aquamarine: 0x7FFFD4,
    azure: 0xF0FFFF,
    beige: 0xF5F5DC,
    bisque: 0xFFE4C4,
    black: 0x000000,
    blanchedalmond: 0xFFEBCD,
    blue: 0x0000FF,
    blueviolet: 0x8A2BE2,
    brown: 0xA52A2A,
    burlywood: 0xDEB887,
    cadetblue: 0x5F9EA0,
    chartreuse: 0x7FFF00,
    chocolate: 0xD2691E,
    coral: 0xFF7F50,
    cornflowerblue: 0x6495ED,
    cornsilk: 0xFFF8DC,
    crimson: 0xDC143C,
    cyan: 0x00FFFF,
    darkblue: 0x00008B,
    darkcyan: 0x008B8B,
    darkgoldenrod: 0xB8860B,
    darkgray: 0xA9A9A9,
    darkgrey: 0xA9A9A9,
    darkgreen: 0x006400,
    darkkhaki: 0xBDB76B,
    darkmagenta: 0x8B008B,
    darkolivegreen: 0x556B2F,
    darkorange: 0xFF8C00,
    darkorchid: 0x9932CC,
    darkred: 0x8B0000,
    darksalmon: 0xE9967A,
    darkseagreen: 0x8FBC8F,
    darkslateblue: 0x483D8B,
    darkslategray: 0x2F4F4F,
    darkslategrey: 0x2F4F4F,
    darkturquoise: 0x00CED1,
    darkviolet: 0x9400D3,
    deeppink: 0xFF1493,
    deepskyblue: 0x00BFFF,
    dimgray: 0x696969,
    dimgrey: 0x696969,
    dodgerblue: 0x1E90FF,
    firebrick: 0xB22222,
    floralwhite: 0xFFFAF0,
    forestgreen: 0x228B22,
    fuchsia: 0xFF00FF,
    gainsboro: 0xDCDCDC,
    ghostwhite: 0xF8F8FF,
    gold: 0xFFD700,
    goldenrod: 0xDAA520,
    gray: 0x808080,
    grey: 0x808080,
    green: 0x008000,
    greenyellow: 0xADFF2F,
    honeydew: 0xF0FFF0,
    hotpink: 0xFF69B4,
    indianred: 0xCD5C5C,
    indigo: 0x4B0082,
    ivory: 0xFFFFF0,
    khaki: 0xF0E68C,
    lavender: 0xE6E6FA,
    lavenderblush: 0xFFF0F5,
    lawngreen: 0x7CFC00,
    lemonchiffon: 0xFFFACD,
    lightblue: 0xADD8E6,
    lightcoral: 0xF08080,
    lightcyan: 0xE0FFFF,
    lightgoldenrodyellow: 0xFAFAD2,
    lightgray: 0xD3D3D3,
    lightgrey: 0xD3D3D3,
    lightgreen: 0x90EE90,
    lightpink: 0xFFB6C1,
    lightsalmon: 0xFFA07A,
    lightseagreen: 0x20B2AA,
    lightskyblue: 0x87CEFA,
    lightslategray: 0x778899,
    lightslategrey: 0x778899,
    lightsteelblue: 0xB0C4DE,
    lightyellow: 0xFFFFE0,
    lime: 0x00FF00,
    limegreen: 0x32CD32,
    linen: 0xFAF0E6,
    magenta: 0xFF00FF,
    maroon: 0x800000,
    mediumaquamarine: 0x66CDAA,
    mediumblue: 0x0000CD,
    mediumorchid: 0xBA55D3,
    mediumpurple: 0x9370D8,
    mediumseagreen: 0x3CB371,
    mediumslateblue: 0x7B68EE,
    mediumspringgreen: 0x00FA9A,
    mediumturquoise: 0x48D1CC,
    mediumvioletred: 0xC71585,
    midnightblue: 0x191970,
    mintcream: 0xF5FFFA,
    mistyrose: 0xFFE4E1,
    moccasin: 0xFFE4B5,
    navajowhite: 0xFFDEAD,
    navy: 0x000080,
    oldlace: 0xFDF5E6,
    olive: 0x808000,
    olivedrab: 0x6B8E23,
    orange: 0xFFA500,
    orangered: 0xFF4500,
    orchid: 0xDA70D6,
    palegoldenrod: 0xEEE8AA,
    palegreen: 0x98FB98,
    paleturquoise: 0xAFEEEE,
    palevioletred: 0xD87093,
    papayawhip: 0xFFEFD5,
    peachpuff: 0xFFDAB9,
    peru: 0xCD853F,
    pink: 0xFFC0CB,
    plum: 0xDDA0DD,
    powderblue: 0xB0E0E6,
    purple: 0x800080,
    red: 0xFF0000,
    rosybrown: 0xBC8F8F,
    royalblue: 0x4169E1,
    saddlebrown: 0x8B4513,
    salmon: 0xFA8072,
    sandybrown: 0xF4A460,
    seagreen: 0x2E8B57,
    seashell: 0xFFF5EE,
    sienna: 0xA0522D,
    silver: 0xC0C0C0,
    skyblue: 0x87CEEB,
    slateblue: 0x6A5ACD,
    slategray: 0x708090,
    slategrey: 0x708090,
    snow: 0xFFFAFA,
    springgreen: 0x00FF7F,
    steelblue: 0x4682B4,
    tan: 0xD2B48C,
    teal: 0x008080,
    thistle: 0xD8BFD8,
    tomato: 0xFF6347,
    turquoise: 0x40E0D0,
    violet: 0xEE82EE,
    wheat: 0xF5DEB3,
    white: 0xFFFFFF,
    whitesmoke: 0xF5F5F5,
    yellow: 0xFFFF00,
    yellowgreen: 0x9ACD32
};

function lerp(start, end, percent) {
    return makeGradientColor(hexToRgb(start), hexToRgb(end), percent);
}

var hexTriplet = "01".substr(-1) === "1" ?
// pad 6 zeros to the left
function (cssColor) {
    return "#" + ("00000" + cssColor.toString(16)).substr(-6);
} : // IE doesn't support substr with negative numbers
function (cssColor) {
    var str = cssColor.toString(16);
    return "#" + new Array(str.length < 6 ? 6 - str.length + 1 : 0).join("0") + str;
};
function hexToRgb(hex) {
    if (cache[hex]) return cache[hex];
    var cssColor = null;
    if (cssColors[hex]) {
        cssColor = hex;
        hex = hexTriplet(cssColors[hex]);
    }

    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function (m, r, g, b) {
        return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    var key = cssColor ? cssColor : hex;
    cache[key] = result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
    return cache[key];
}

function makeGradientColor(color1, color2, percent) {
    var newColor = {};

    if (percent < 0) percent = 0;
    if (percent > 100) percent = 100;
    function makeChannel(a, b) {
        return a + Math.round((b - a) * (percent / 100));
    }

    function makeColorPiece(num) {
        num = Math.min(num, 255); // not more than 255
        num = Math.max(num, 0); // not less than 0
        var str = num.toString(16);
        if (str.length < 2) {
            str = "0" + str;
        }
        return str;
    }

    newColor.r = makeChannel(color1.r, color2.r);
    newColor.g = makeChannel(color1.g, color2.g);
    newColor.b = makeChannel(color1.b, color2.b);
    newColor.cssColor = "#" + makeColorPiece(newColor.r) + makeColorPiece(newColor.g) + makeColorPiece(newColor.b);
    return newColor.cssColor;
}

var color = {
    lerp: lerp,
    hexToRgb: hexToRgb,
    makeGradientColor: makeGradientColor
};

var curvejs = {
    Curve: Curve$1,
    Group: Group,
    Stage: Stage$1,
    motion: motion$1,
    Word: Word,
    perlin: p5,
    color: color
};

var Stage = curvejs.Stage;
var Curve = curvejs.Curve;
var motion = curvejs.motion;


var canvas = document.getElementById('myCanvas');
var stage = new Stage(canvas);

var data = [[70, 70, 12, 76, 12, 123, 70, 128], [25, 68, 23, 140, 80, 140, 74, 100], [73, 62, 72, 90, 75, 110, 93, 134], [21, 62, 21, 62, 21, 128, 21, 128], [21, 128, 17, 96, 17, 68, 65, 60], [12, 58, 41, 132, 61, 132, 96, 58], [44, 104, 112, 52, -20, 82, 77, 136], [52, 48, 53, 48, 54, 49, 52, 48], [8, 175, 24, 204, 60, 197, 56, 74], [81, 72, 17, 42, 105, 145, 41, 120]];
var position = [0, 0, 60, 0, 60, 0, 145, 0, 145, 0, 210, 10, 280, -5, 350, 0, 350, 0, 400, 0];
var colors = ['#22CAB3', '#22CAB3', '#22CAB3', '#22CAB3', '#22CAB3', '#22CAB3', '#22CAB3', '#FF7784', '#FF7784', '#FF7784'];
var rd = function rd() {
    return -2 + Math.random() * 2;
};

var rdX = function rdX() {
    return 10 + Math.floor(Math.random() * (canvas.width - 20 + 1));
};

var rdY = function rdY() {
    return 10 + Math.floor(Math.random() * (canvas.height - 20 + 1));
};

var motionFn = function motion(points, data) {
    var _this = this;

    points.forEach(function (item, index) {
        points[index] += data[index];

        if (index % 2 === 0) {
            if (points[index] + _this.x < 0) {
                points[index] = -_this.x;
                data[index] *= -1;
            }

            if (points[index] + _this.x > canvas.width) {
                points[index] = canvas.width - _this.x;
                data[index] *= -1;
            }
        } else {
            if (points[index] + _this.y < 0) {
                points[index] = -_this.y;
                data[index] *= -1;
            }

            if (points[index] + _this.y > canvas.height) {
                points[index] = canvas.height - _this.y;
                data[index] *= -1;
            }
        }
    });
};

function dance() {
    stage.children.forEach(function (child, index) {
        child.pointsTo(data[index], 2000, {
            end: function end() {
                var _this2 = this;

                setTimeout(function () {
                    _this2.play();
                }, 3000);
            }
        });
    });
}

(function main() {
    for (var i = 0; i < 10; i++) {

        var curve = new Curve({
            x: position[i * 2] + 30,
            y: position[i * 2 + 1] + 80,
            color: colors[i],
            points: [rdX(), rdY(), rdX(), rdY(), rdX(), rdY(), rdX(), rdY()],
            motion: motionFn,
            data: [rd(), rd(), rd(), rd(), rd(), rd(), rd(), rd()]
        });
        stage.add(curve);
    }

    setTimeout(function () {
        return dance();
    }, 2000);
    setInterval(function () {
        return dance();
    }, 10000);
})();

function tick$1() {
    stage.update();
    requestAnimationFrame(tick$1);
}

tick$1();

})));

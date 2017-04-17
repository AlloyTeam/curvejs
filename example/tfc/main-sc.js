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
var dance = function (points, data) {
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

var motion$1 = {
    dance: dance,
    move: move,
    rotate: rotate,
    to: to,
    line: line,
    circle: circle,
    close: path.close,
    open: path.open
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





var defineProperty = function (obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
};



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

        this.points = option.points || [];
        this.color = option.color || 'black';
        this.x = option.x || 0;
        this.y = option.y || 0;
        this.vision = option.vision || [];
        this.visionMax = 640;
        this.visionInterval = option.visionInterval || 10;

        this._preDate = Date.now();
        this._now = new Date();

        this.data = option.data;

        this.copyPoints = this.points.slice(0);
        this.motion = option.motion || motion$1.dance;

        this._initVision(option.visionCount || 80);
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
                if (this.vision.length > this.visionMax) {
                    this.vision.splice(0, 8);
                }
                this._preDate = this._now;
            }

            this.motion.call(this, this.points, this.data);
        }
    }, {
        key: 'draw',
        value: function draw(ctx) {
            this.tick();
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.globalAlpha = 1;
            var points = this.points;
            ctx.beginPath();
            ctx.strokeStyle = this.color;
            ctx.moveTo.call(ctx, points[0], points[1]);
            ctx.bezierCurveTo.call(ctx, points[2], points[3], points[4], points[5], points[6], points[7]);
            ctx.stroke();

            var vision = this.vision;

            var i = 0,
                len = vision.length;
            for (; i < len; i += 8) {
                ctx.globalAlpha = i / this.visionMax * 0.1;
                ctx.beginPath();
                ctx.moveTo.call(ctx, vision[i], vision[i + 1]);
                ctx.bezierCurveTo.call(ctx, vision[i + 2], vision[i + 3], vision[i + 4], vision[i + 5], vision[i + 6], vision[i + 7]);
                ctx.stroke();
            }
            ctx.restore();
        }
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

var data = {

    'c': [[70, 70, 12, 76, 12, 123, 70, 128]],
    'u': [[25, 68, 23, 140, 80, 140, 74, 100], [73, 62, 72, 90, 75, 110, 93, 134]],
    'r': [[21, 62, 21, 62, 21, 128, 21, 128], [21, 128, 17, 96, 17, 68, 65, 60]],
    'v': [[12, 58, 41, 132, 61, 132, 96, 58]],
    'j': [[52, 48, 53, 48, 54, 49, 52, 48], [8, 175, 24, 204, 60, 197, 56, 74]],
    'e': [[44, 104, 112, 52, -20, 82, 77, 136]], 's': [[81, 72, 17, 42, 105, 145, 41, 120]],
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

        _this.points = data[word];

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

var curvejs = {
    Curve: Curve$1,
    Group: Group,
    Stage: Stage$1,
    motion: motion$1,
    Word: Word
};

var Stage = curvejs.Stage;
var Curve = curvejs.Curve;
var motion = curvejs.motion;


var canvas = document.getElementById('myCanvas');
var stage = new Stage(canvas);

var rd = function rd() {
    return -2 + Math.random() * 2;
};

var tencent = [2, 1, 2, 1, 13, 1, 13, 1, 7, 1, 7, 1, 7, 15, 7, 15, 21, 1, 21, 1, 29, 1, 29, 1, 21, 1, 21, 1, 21, 15, 21, 15, 21, 15, 21, 15, 29, 14, 29, 14, 22, 7, 22, 7, 28, 7, 28, 7, 38, 1, 38, 1, 38, 15, 38, 15, 39, 1, 39, 1, 49, 15, 49, 15, 49, 1, 49, 1, 49, 15, 49, 15, 70, 2, 57, 0, 58, 13, 69, 13, 80, 1, 80, 1, 87, 1, 87, 1, 80, 1, 80, 1, 80, 14, 80, 14, 80, 14, 80, 14, 87, 14, 87, 14, 81, 7, 81, 7, 87, 7, 87, 7, 97, 1, 97, 1, 97, 14, 97, 14, 98, 1, 98, 1, 108, 14, 108, 14, 108, 1, 108, 1, 108, 14, 108, 14, 117, 1, 117, 1, 128, 1, 128, 1, 123, 2, 123, 2, 122, 14, 122, 14];

var web = [147, 1, 147, 1, 151, 14, 151, 14, 151, 14, 151, 14, 157, 1, 157, 1, 157, 1, 157, 1, 161, 14, 161, 14, 161, 14, 161, 14, 165, 1, 165, 1, 176, 1, 176, 1, 183, 1, 183, 1, 175, 1, 175, 1, 175, 14, 175, 14, 176, 14, 176, 14, 183, 14, 183, 14, 176, 7, 176, 7, 182, 7, 182, 7, 193, 1, 193, 1, 193, 14, 193, 14, 193, 1, 201, 0, 201, 6, 193, 7, 193, 7, 201, 7, 201, 14, 192, 14];

var fe = [223, 1, 223, 1, 230, 1, 230, 1, 223, 1, 223, 1, 222, 15, 222, 15, 223, 8, 223, 8, 230, 9, 230, 9, 240, 1, 240, 1, 240, 15, 240, 15, 240, 1, 250, 1, 249, 8, 240, 8, 244, 8, 244, 8, 249, 15, 249, 15, 264, 1, 254, 1, 253, 13, 264, 14, 264, 1, 273, 1, 273, 14, 264, 14, 281, 1, 281, 1, 281, 15, 281, 15, 281, 1, 281, 1, 291, 14, 291, 14, 291, 14, 291, 14, 291, 1, 291, 1, 302, 1, 302, 1, 311, 1, 311, 1, 307, 2, 307, 2, 306, 15, 306, 15, 319, 9, 319, 9, 325, 9, 325, 9, 335, 1, 335, 1, 335, 14, 335, 14, 335, 14, 335, 14, 343, 14, 343, 14, 336, 7, 336, 7, 342, 7, 342, 7, 335, 1, 335, 1, 343, 1, 343, 1, 352, 1, 352, 1, 352, 14, 352, 14, 353, 1, 353, 1, 362, 14, 362, 14, 362, 14, 362, 14, 363, 1, 363, 1, 375, 1, 375, 1, 375, 14, 375, 14, 375, 1, 387, 0, 388, 14, 375, 14];

var cf = [417, 2, 402, 1, 402, 14, 416, 13, 432, 1, 422, 0, 421, 13, 432, 14, 432, 14, 443, 14, 442, 1, 432, 1, 450, 1, 450, 1, 449, 15, 449, 15, 450, 1, 450, 1, 459, 14, 459, 14, 460, 1, 460, 1, 459, 15, 459, 15, 471, 1, 471, 1, 479, 1, 479, 1, 471, 15, 471, 15, 472, 1, 472, 1, 472, 8, 472, 8, 478, 8, 478, 8, 488, 1, 488, 1, 495, 2, 495, 2, 488, 1, 488, 1, 488, 14, 488, 14, 488, 14, 488, 14, 495, 14, 495, 14, 488, 7, 488, 7, 495, 7, 495, 7, 505, 1, 505, 1, 505, 15, 505, 15, 505, 1, 516, 1, 516, 8, 505, 8, 510, 8, 510, 8, 514, 14, 514, 14, 525, 1, 525, 1, 531, 1, 531, 1, 524, 1, 524, 1, 524, 15, 524, 15, 524, 7, 524, 7, 531, 7, 531, 7, 525, 14, 525, 14, 531, 14, 531, 14, 542, 1, 542, 1, 541, 15, 541, 15, 542, 1, 542, 1, 551, 14, 551, 14, 552, 1, 552, 1, 552, 14, 552, 14, 572, 2, 558, 1, 559, 13, 573, 13, 583, 1, 583, 1, 583, 14, 583, 14, 583, 14, 583, 14, 590, 14, 590, 14, 583, 7, 583, 7, 589, 7, 589, 7, 583, 1, 583, 1, 590, 1, 590, 1];

function createCurve(arr, color) {
    arr.forEach(function (item, index, self) {
        if (index % 8 === 0) {
            var curve = new Curve(defineProperty({
                x: 10, y: 100,
                color: color,
                points: [self[index], self[1 + index], self[2 + index], self[3 + index], self[4 + index], self[5 + index], self[6 + index], self[7 + index]],
                data: [rd(), rd(), rd(), rd(), rd(), rd(), rd(), rd()],
                motion: motion.dance
            }, 'data', { angle: 0, r: 5, step: Math.PI / 100 }));

            stage.add(curve);
        }
    });
}

function tick$1() {
    stage.update();
    requestAnimationFrame(tick$1);
}

createCurve(tencent, '#00FF00');
createCurve(web, '#00FF00');
createCurve(fe, '#00FF00');
createCurve(cf, '#00FF00');

tick$1();

})));

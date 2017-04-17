(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (factory());
}(this, (function () { 'use strict';

var util = {

    random: function random(min, max) {
        return min + Math.floor(Math.random() * (max - min + 1));
    },

    randomColor: function randomColor() {
        return ['#22CAB3', '#90CABE', '#A6EFE8', '#C0E9ED', '#C0E9ED', '#DBD4B7', '#D4B879', '#ECCEB2', '#F2ADA6', '#FF7784'][util.random(0, 9)];
        // return '#'+(Math.random()*0xffffff<<0).toString(16);
    },

    randomSpeed: function randomSpeed() {
        return (Math.random() > 0.5 ? 1 : -1) * Math.random() * 2;
    }

};

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

var Curve = function () {
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
                ctx.strokeStyle = this.color;
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
        key: 'addExistLine',
        value: function addExistLine(process) {}
    }, {
        key: 'sameAs',
        value: function sameAs(index) {}
    }, {
        key: 'update',
        value: function update() {
            var _this2 = this;

            this.ctx.clearRect(0, 0, this.width, this.height);
            this.children.forEach(function (child) {
                child.draw(_this2.ctx);
            });
        }
    }]);
    return Stage;
}(Group);

/**
 * Created by dntzhang on 2017/4/15.
 */
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

var Word$1 = function (_Group) {
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

                _this2.add(new Curve({
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
    Curve: Curve,
    Group: Group,
    Stage: Stage$1,
    motion: motion$1,
    Word: Word$1
};

var Stage = curvejs.Stage;
var Word = curvejs.Word;
var motion = curvejs.motion;


var lineCount = 10;
var random$1 = util.random;
var randomColor$1 = util.randomColor;
var randomSpeed$1 = util.randomSpeed;
var stage = new Stage(500, 250, '#container');

function generatePosition() {

    stage.add(new Word('c', {
        color: '#22CAB3',
        motion: motion.dance,
        data: { angle: 0, r: 5, step: Math.PI / 50 }

    }));

    stage.add(new Word('u', {
        color: '#22CAB3',
        x: 60,
        motion: motion.dance,
        data: { angle: 0, r: 5, step: Math.PI / 50 }
    }));

    stage.add(new Word('r', {
        color: '#22CAB3',
        x: 145,
        motion: motion.dance,
        data: { angle: 0, r: 5, step: Math.PI / 50 }
    }));

    stage.add(new Word('v', {
        color: '#22CAB3',
        x: 210,
        y: 10,
        motion: motion.dance,
        data: { angle: 0, r: 5, step: Math.PI / 50 }
    }));

    stage.add(new Word('e', {
        color: '#22CAB3',
        x: 280,
        y: -5,
        motion: motion.dance,
        data: { angle: 0, r: 5, step: Math.PI / 50 }
    }));

    stage.add(new Word('j', {
        color: '#FF7784',
        x: 350,
        motion: motion.dance,
        data: { angle: 0, r: 5, step: Math.PI / 50 }
    }));

    stage.add(new Word('s', {
        color: '#FF7784',
        x: 400,
        motion: motion.dance,
        data: { angle: 0, r: 5, step: Math.PI / 50 }
    }));
}

function tick$1() {
    stage.update();
    requestAnimationFrame(tick$1);
}

(function main() {
    generatePosition();
    tick$1();
})();

})));

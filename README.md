<p align="center">
  <a href ="##"><img alt="curvejs" src="http://images2015.cnblogs.com/blog/105416/201704/105416-20170416212420259-931391833.png"></a>
</p>
<p align="center">
Made curve a dancer in HTML5 canvas. 
</p>
<p align="center">
  <a href="https://travis-ci.org/AlloyTeam/omi"><img src="https://travis-ci.org/AlloyTeam/omi.svg"></a>
</p>

---
## [中文README](https://github.com/AlloyTeam/curvejs/blob/master/README-CN.md)

## Demos

* [Water](https://alloyteam.github.io/curvejs/example/water/)
* [Sprout](https://alloyteam.github.io/curvejs/example/sprout/)
* [Scale-To](https://alloyteam.github.io/curvejs/pg/rd.html?type=scale)
* [Points-To](https://alloyteam.github.io/curvejs/pg/rd.html?type=points-to)
* [Rotate](https://alloyteam.github.io/curvejs/pg/rd.html?type=rotate)
* [Word](https://alloyteam.github.io/curvejs/pg/rd.html?type=word)
* [Perlin-Noise](https://alloyteam.github.io/curvejs/pg/rd.html?type=noise)
* [Simple](https://alloyteam.github.io/curvejs/pg/rd.html?type=simple)
* [Simple-ES5](https://alloyteam.github.io/curvejs/pg/rd.html?type=simple-es5)
* [Lerp Color](https://alloyteam.github.io/curvejs/pg/rd.html?type=color)
* [Curves](https://alloyteam.github.io/curvejs/pg/rd.html?type=curves)
* [Line](https://alloyteam.github.io/curvejs/pg/rd.html?type=line)
* [Close](https://alloyteam.github.io/curvejs/pg/rd.html?type=close)

## Usage

```bash
$ npm install curvejs
```

```javascript
import curvejs from 'curvejs'
```

Or get it by the cdn and link `curve.min.js` in your HTML:

```html
<script src="https://unpkg.com/curvejs@0.3.3/dist/curve.min.js"></script>
```

Then start to dance:

```js
var Stage = curvejs.Stage,
    Curve = curvejs.Curve,
    canvas = document.getElementById('myCanvas'),
    stage = new Stage(canvas),
    rd = function() {
        return -2 + Math.random() * 2
    }

var curve = new Curve({
    color: '#00FF00',
    points: [277, 327, 230, 314, 236, 326, 257, 326],
    data: [rd(), rd(), rd(), rd(), rd(), rd(), rd(), rd()],
    motion: function motion(points, data) {
      points.forEach(function (item, index) {
          points[index] += data[index]
      })
    }
})

stage.add(curve)

function tick(){
    stage.update()
    requestAnimationFrame(tick)
}

tick()
```

## Using built-in motion

```js
var curve = new Curve({
    points: [277, 327, 230, 314, 236, 326, 257, 326],
    data: {angle: 0, r:5 ,step:Math.PI / 50 },
    motion: curvejs.motion.dance
})
```

## Submit your motion

In [this motion directory](https://github.com/AlloyTeam/curvejs/tree/master/src/motion), there are already some built-in motion. you can submit your motion and then create a pull request to the project. 

Format and specification of your motion:

```js
/**
 * move motion.
 *
 * @param {points}
 * @param {data}
 *      data rule example:
 *      [1, 0.2, -3, 0.7, 0.5, 0.3, -1, 1]
 */
export default function (points, data) {
    points.forEach(function (item, index) {
        points[index] += data[index]
    })
}
```

## QQ Group

The group id is 179181560. Welcome to join the group.

## License

[MIT](http://opensource.org/licenses/MIT)

Copyright (c) 2017-present, dntzhang & AlloyTeam
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

## Usage

```bash
$ npm install curvejs
```

```javascript
import curvejs from 'curvejs'
```

Or get it by the cdn and link `curvejs.min.js` in your HTML:

```html
<script src="https://unpkg.com/omi@0.1.0/dist/curvejs.min.js"></script>
```

Then start to dance:

```js
var   Stage = curvejs.Stage,
      Curve = curvejs.Curve,
      motion = curvejs.motion,
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

          if (points[index] < 0) {
              points[index] = 0
              data[index] *= -1
          }
          if (index % 2 === 0) {
              if (points[index] > canvas.width) {
                  points[index] = canvas.width
                  data[index] *= -1
              }
          } else {
              if (points[index] > canvas.height) {
                  points[index] = canvas.height
                  data[index] *= -1
              }
          }
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

## Submit your motion

## Demos






====

[MIT License](LICENSE.md). ? 2017 [dntzhnag&AlloyTeam](http://alloyteam.com).

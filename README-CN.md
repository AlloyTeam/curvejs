## 腾讯AlloyTeam正式发布Web魔幻线条 - curvejs

![](http://images2015.cnblogs.com/blog/105416/201704/105416-20170423095323554-971072124.png)

[curvejs](https://github.com/AlloyTeam/curvejs) 中文读["克js"]，是腾讯AlloyTeam打造的一款魔幻线条框架，让线条成为一名优秀的舞者，让线条们成为优秀的舞团，HTML5 Canvas就是舞台。

官网：[https://alloyteam.github.io/curvejs/](https://alloyteam.github.io/curvejs/)

你还记得window经典的屏幕保护程序《变幻线》吗？

![](http://images2015.cnblogs.com/blog/105416/201704/105416-20170421100349227-820259243.png)

其原理就是使用 Perlin-Noise + Particle System + Bézier Curve + Color Transition 制作而成。

使用curvejs实现类似变幻线功能只需要几行代码：

```js
const  { Stage, Curve, motion } = curvejs

let stage = new Stage(document.getElementById('myCanvas'))

stage.add(new Curve({
    color: '#00FF00',
    data: {value: 0, step: 0.008, width: 600, height: 400},
    motion: motion.noise
}))

function tick(){
    stage.update()
    requestAnimationFrame(tick)
}

tick()
```

[【体验地址】](https://alloyteam.github.io/curvejs/pg/rd.html?type=noise)

当然，curvejs的能力不仅仅是变换线，这完全取决于你的想象力。比如：

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

## 使用指南

```bash
$ npm install curvejs
```

```javascript
import curvejs from 'curvejs'
```

也可以直接插入script到你的HTML页面:

```html
<script src="https://unpkg.com/curvejs@0.3.2/dist/curve.min.js"></script>
```

开始跳舞:

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

上面的points代表了三次贝塞尔曲线的4个点。motion代表运动方式，motion可以拿到points和data。motion里函数的this指向Curve是实例curve。


## 使用内置motion

```js
var curve = new Curve({
    points: [277, 327, 230, 314, 236, 326, 257, 326],
    data: {angle: 0, r:5 ,step:Math.PI / 50 },
    motion: curvejs.motion.dance
})
```

## 基本原理
![](http://images2015.cnblogs.com/blog/105416/201704/105416-20170421100408884-843332110.png)


* 每次创建Curve 可以传入八个数字，其实就代表上面的4个点的坐标
* motion里可以拿到 points 进行自定义变幻
* 幻影不需要开发者考虑，curvejs会自动生成幻影

这里需要特别强调，curvejs的幻影不是利用canvas的黑色底，然后fillRect填充半透而产生，而是Particle System。所以curvejs制作出的效果不用一定是黑色背景，而且canvas也可以是透明，这就大大增加了适用场景。

## 提交你的motion

在 [ motion 目录](https://github.com/AlloyTeam/curvejs/tree/master/src/motion), 有许多内置的motion提供给开发者使用，但是你也可以提交你的motion到这个项目，我会第一时间review并合入主干。

基本motion格式规则:

```js
/**
 * motion description.
 *
 * @param {points}
 * @param {data}
 *      data rule example:
 *      [1, 0.2, -3, 0.7, 0.5, 0.3, -1, 1]
 */
export default function (points, data) {
    //你的motion逻辑
}
```

## curvejs相关

* 官网：[https://alloyteam.github.io/curvejs/](https://alloyteam.github.io/curvejs/)
* Github: [https://github.com/AlloyTeam/curvejs](https://github.com/AlloyTeam/curvejs)
* 更加方便的交流关于curvejs的一切可以加入QQ的curvejs交流群(179181560)

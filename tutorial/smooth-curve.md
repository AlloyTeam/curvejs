# 折线平滑方案演进

平滑折线的场景还是蛮多的，如软体模拟、数学方程可视化、流体模拟、数据可视化、屏保程序[curvejs](https://github.com/AlloyTeam/curvejs)等等方面都有其用武之地。如水的模拟:

![usage](http://images0.cnblogs.com/blog2015/105416/201508/251939571561058.png)

心形函数方程转图像:

![usage](http://images0.cnblogs.com/blog2015/105416/201508/251940011098732.png)

因为方程的输入和输出是无限多个，需要绘制方程图像可以只绘制其中一部分点，然后再smooth点连接起的折线。

再比如线性报表中的折线smooth化:

![usage](http://images0.cnblogs.com/blog2015/105416/201508/251939511257781.png)

本文将使用两种方式将折线平滑化，并对比其优劣点:

* 通过三次贝塞尔曲线将有限个数的点平滑化
* 通过二次贝塞尔曲线将有限个数的点平滑化

## 问题建模
已知若干个点，绘制出该点连接的曲线。

```javascript
<canvas width="480" height="480"></canvas>
<script>
    function drawPath(path){
        //实现
    }
    
    drawPath([{ x: 50, y: 50 }, { x: 200, y: 100 }, { x: 250, y: 50 }, { x: 350, y: 150 }, { x: 370, y: 100 }, { x: 570, y: 200 }])
</script>
```

这里实验平台使用浏览器环境，即Canvas相关API以及javascript语言。

这里canvas的上下文对象拥有了bezierCurveTo方法:

```javascript
context.bezierCurveTo(cp1x,cp1y,cp2x,cp2y,x,y);
```


## 三次贝塞尔平滑图解
实现目标

![usage](http://images0.cnblogs.com/blog2015/105416/201508/252022052033323.png)

具体过程
![usage](http://images0.cnblogs.com/blog2015/105416/201508/252022149062488.png)


### 代码
Vector2，一般用来表示向量，但有的时候也用来当作点来进行一计算。
```javascript
var Vector2 = function(x, y) {
        this.x = x;
        this.y = y;
}
Vector2.prototype = {
    "length": function () {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    },
    "normalize": function () {
        var inv = 1 / this.length();
        return new Vector2(this.x * inv, this.y * inv);
    },
    "add": function (v) {
        return new Vector2(this.x + v.x, this.y + v.y);
    },
    "multiply": function (f) {
        return new Vector2(this.x * f, this.y * f);
    },
    "dot": function (v) {
        return this.x * v.x + this.y * v.y;
    },
    "angle": function (v) {
        return Math.acos(this.dot(v) / (this.length() *v.length())) * 180 / Math.PI;
    }
}
```
其中:

* length求向量长度
* normalize转单位向量
* add向量叠加
* multiply向量翻倍
* dot内积
* angle方法用来求两个向量的夹角

核心方法，根据path上的点，求出所有贝塞尔曲线控制点。

```javascript
function getControlPoint(path) {
    var rt = 0.3;
    var i = 0, count = path.length - 2;
    var arr = [];
    for (; i < count; i++) {
        var a = path[i], b = path[i + 1], c = path[i + 2];
        var v1 = new Vector2(a.x - b.x, a.y - b.y);
        var v2 = new Vector2(c.x - b.x, c.y - b.y);
        var v1Len = v1.length(), v2Len = v2.length();
        var centerV = v1.normalize().add(v2.normalize()).normalize();
        var ncp1 = new Vector2(centerV.y, centerV.x * -1);
        var ncp2 = new Vector2(centerV.y * -1, centerV.x);
        if (ncp1.angle(v1) < 90) {
            var p1 = ncp1.multiply(v1Len * rt).add(b);
            var p2 = ncp2.multiply(v2Len * rt).add(b);
            arr.push(p1, p2)
        } else {
            var p1 = ncp1.multiply(v2Len * rt).add(b);
            var p2 = ncp2.multiply(v1Len * rt).add(b);
            arr.push(p2, p1)
        }
    }
    return arr;
}
```

### Demo&Source

* [在线演示](https://alloyteam.github.io/curvejs/asset/smooth.html)
* [源码](https://github.com/AlloyTeam/curvejs/blob/master/asset/smooth.html)

## 二次贝塞尔平滑图解

![](http://images2015.cnblogs.com/blog/105416/201705/105416-20170508113858863-1718221525.jpg)

如上图所示:

* 除了起点和终点，其余这线上的点全变成二次贝塞尔曲线上的控制点
* 除了起始线段和终点线段，其余线段的**中点**全变成二次贝塞尔曲线的起点和终点

### 代码

这里canvas的上下文对象拥有了quadraticCurveTo方法:

```javascript
context.quadraticCurveTo(cpx,cpy,x,y);
```

具体实现:

``` js
ctx.beginPath();
ctx.moveTo(points[0], points[1]);
for (let i = 2, len = points.length; i < len; i += 2) {
    if (i === points.length - 4) {
        ctx.quadraticCurveTo(points[i], points[i + 1], points[i + 2], points[i + 3]);
    } else {
        ctx.quadraticCurveTo(points[i], points[i + 1], (points[i] + points[i + 2]) / 2, ((points[i + 1] + points[i + 3]) / 2));
    }
}
ctx.stroke();
``` 

### Demo&Source

* [在线演示](https://alloyteam.github.io/curvejs/asset/smooth2.html)
* [源码](https://github.com/AlloyTeam/curvejs/blob/master/src/smooth-curve.js)

## 两种方案对比

* 三次贝塞尔平滑方案曲线**经过**折线上线段的起点和中点
* 二次贝塞尔平滑方案曲线**不经过**折线上线段的起点和中点
* 三次贝塞尔平滑方案计算量远大于二次贝塞尔平滑方案
* 三次贝塞尔平滑方案在进行交叉或者碰撞检测时显得更加精确
* 二次贝塞尔平滑方案在进行交叉或者碰撞检测时显得不够精确

    注意，这里的碰撞检测是指的与折线的每条线段是否碰撞来判定是否与曲线碰撞。比如割绳子游戏里的绳子，明显使用三次贝塞尔平滑方案会带来更好的用户体验，当然如果点的数量足够多、点与点的间隔很小的情况下，交叉或者碰撞检测看上去就差别不大。其实上面总结了一大堆可以提炼成一句话：

* 要想准确Smooth计算量更大（三次贝塞尔平滑方案），否则计算量小（二次贝塞尔平滑方案）

关键要看平滑后的作用，如果只是为了视觉效果可以使用二次贝塞尔平滑方案，如果拥有用户交互碰撞检测，可以使用三次贝塞尔平滑方案。
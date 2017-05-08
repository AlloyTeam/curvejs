## 简介

[curvejs](https://github.com/AlloyTeam/curvejs)支持[smooth-curve](https://github.com/AlloyTeam/curvejs/blob/master/src/smooth-curve.js)。
这个smooth-curve非常有用，你只需要给其一堆点，它自动帮你平滑成曲线。
绳子的本质就是 smooth 的 joint(关节)。 关节是由于各个关节点组成，相互连结且互相约束的物体，常见于各类物理引擎当中。关节的运用非常广泛，例如人体模拟、动物行走模拟、器材、绳子、机关、链桥等都可以灵活利用关节去模拟。

![](http://images2015.cnblogs.com/blog/105416/201705/105416-20170505102404836-1010190001.jpg)

## 关节

关节通常用下面这种表达方式：

class Joint {
    constructor(segLength, segCount, isFixed, startPoint) {
        this.segLength = segLength
        this.segCount = segCount
        this.isFixed = isFixed
        this.startPoint = startPoint
        this.points = []
        for (var i = 0; i < this.segCount; i++) {
            this.points.push(new Vector2(this.startPoint.x, this.startPoint.y + i * this.segLength))
        }
    }
}

普通的关节分两种，一种是有固定点，一种没有固定点，其中：

* segLength表示关节每一段的长度（这里假定关节每一段是相等的）
* segCount表示关节个数（包括起点和终点）
* isFixed表示关节是否有固定点（如果isFixed为true,假设startPoint为固定点）
* startPoint表示关节的起点（这里假定关节的初始状态是笔直向下的）
* points表示关节上所有的支点（包括起点和终点）

这里需要了解的是 ，在完整的关节表示当中，为了更好的模拟现实世界当中的物体，关节还会加上一个角度区间限制，即关节的最大张开角度和最小的角度。本文的关节不加此限制，任其360度无障碍旋转。

## 绘制关节

定义一个拥有15个关节段，每段长度为20的关节。完整代码如下所示：

let canvas = document.getElementById('myCanvas')
let stage = new Stage(canvas)

let joint = new Joint(20, 15, false, new Vector2(200, 100)),
    points = []

joint.points.forEach(v=>{
    points.push(v.x,v.y)
})

let curve = new SmoothCurve({
    color:["#754726","#42270C"],
    points: points,
    disableVision:true,
    size:4
})

stage.add(curve)

效果如图所示：

## 与鼠标交互

要让关节绕着对应的支点动起来，这里让关节的终点跟随鼠标的位置移动。

在方法中加入：

```js
canvas.addEventListener('mousemove',function(evt){
    var rect = canvas.getBoundingClientRect()
    joint.points[joint.points.length - 1] = new Vector2(evt.clientX - rect.left, evt.clientY - rect.top)
    joint.updatePointsPosition(joint.points[joint.points.length - 1], joint.points.length - 1)


    joint.points.forEach((v,i)=>{
        points[i*2] = v.x
        points[i*2+1]=v.y
    })
},false)
```

所以，当鼠标移动的时候，需要实时的更新关节的位置。如下图所示：

image

这里需要注意的两点是：

上图描述的是一次微小的拉动，真正要呈现如图所示的前后状态，其实已经经历的很多次位置更新

上图反向延长线经过初始点是不准确的，准确的位置是初始点靠右一段距离（取决于两条线段的合力方向，但这不影响关节的模拟）

image


在分析完具体的过程之后，利用递归的思路依次更新所有的点。更新方法接收两个参数：一个是更新的点、一个是该点的index，当index为1的时候退出递归。


    var p = Joint.prototype;
    p.updatePointsPosition = function (point, index) {
        var tempV = this.points[index - 1].sub(point).setLength(this.segLength);
        this.points[index - 1] = point.add(tempV);
        if (index > 1) {
            this.updatePointsPosition(this.points[index - 1], index - 1);
        } 
    }

其中var tempV = this.points[index - 1].sub(point).setLength(this.segLength);是计算支点的偏移量，Vector2.setLength是经过normalize（转换为该向量的单位向量） 再multiplyScalar（设置长度）。如下代码所示：

setLength: function (l) {

         return this.normalize().multiplyScalar(l);

     },
完整代码参见Vector2类。
运行效果如下所示：
固定起始点
上面呈现的是没有固定点的关节，那么如果拥有固定点，该怎么更新关节上所有点的位置呢？需要做的仅仅是校正startPoint（启始点、固定点）的位置。

updatePointsPosition(point, index) {
    var tempV = this.points[index - 1].sub(point).setLength(this.segLength)
    this.points[index - 1] = point.add(tempV)
    if (index > 1) {
        this.updatePointsPosition(this.points[index - 1], index - 1)
    } else {
        if (this.isFixed) {
            var v = this.points[0].sub(this.startPoint)
            for (var i = 0; i < this.points.length; i++) {
                this.points[i].subSelf(v)
            }
        }
    }
}

当递归到最后，如果该关节是有固定点的，校正所有关节点的位置。效果如下所示：

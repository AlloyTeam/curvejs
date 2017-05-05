import curvejs from  '../../src/index.js'

const  { Stage, Curve, motion, SmoothCurve } = curvejs

var Vector2 = function(x,y) {
    this.x = x
    this.y = y
}

Vector2.prototype={
    sub: function (b) { return new Vector2(this.x - b.x, this.y - b.y) },
    add: function (b) { return new Vector2(this.x + b.x, this.y + b.y) },
    subSelf: function (a) { this.x -= a.x; this.y -= a.y; return this },
    setLength: function (a) { return this.normalize().multiplyScalar(a) },
    multiplyScalar: function (a) { this.x *= a; this.y *= a; return this },
    normalize: function () { return this.divideScalar(this.length()) },
    divideScalar: function (a) { if (a) { this.x /= a; this.y /= a } else this.set(0, 0); return this },
    lengthSq: function () { return this.x * this.x + this.y * this.y },
    length: function () { return Math.sqrt(this.lengthSq()) }
}

var Joint = function (segLength, segCount, isFixed, startPoint) {
    this.segLength = segLength
    this.segCount = segCount
    this.isFixed = isFixed
    this.startPoint = startPoint
    this.points = []
    for (var i = 0; i < this.segCount; i++) {
        this.points.push(new Vector2(this.startPoint.x, this.startPoint.y + i * this.segLength))
    }
}

Joint.prototype.updatePointsPosition = function (point, index) {
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
    size:2
})

stage.add(curve)



canvas.addEventListener('mousemove',function(evt){
    var rect = canvas.getBoundingClientRect()
    joint.points[joint.points.length - 1] = new Vector2(evt.clientX - rect.left, evt.clientY - rect.top)
    joint.updatePointsPosition(joint.points[joint.points.length - 1], joint.points.length - 1)


    joint.points.forEach((v,i)=>{
        points[i*2] = v.x
        points[i*2+1]=v.y
    })
},false)



function tick(){
    stage.update()
    requestAnimationFrame(tick)
}

tick()

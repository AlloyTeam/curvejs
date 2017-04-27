import curvejs from  '../../src/index.js'

const  { Stage, Curve, motion, SmoothCurve, perlin } = curvejs

let canvas = document.getElementById('myCanvas')
let stage = new Stage(canvas)

const rd = function() {
    return -2 + Math.random() * 2
}

const map = function (value, start, end, valueStart, valueEnd) {

    return valueStart + (valueEnd - valueStart) * value / (end - start)
}

let curve = new SmoothCurve({
    color: '#00FF00',
    points: [96,159,150,95,192,166,258,101,307,168,375,100],
    data: { value:0, step:0.001, interval: 10},
    motion: function motion(points, data) {
        points.forEach(function (item, index) {
            if(index%2===1) {
                points[index] += map( perlin.noise(data.value + data.interval*index),0,1,-1,1)

                data.value += data.step
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

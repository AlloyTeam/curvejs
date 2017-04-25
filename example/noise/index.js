import curvejs from  '../../src/index.js'

const  { Stage, Curve, motion, perlin } = curvejs

let canvas = document.getElementById('myCanvas')
let stage = new Stage(canvas)

const rd = function() {
    return -2 + Math.random() * 2
}

let curve = new Curve({
    color: '#00FF00',
    points: [277, 327, 230, 314, 236, 326, 257, 326],
    data: { value:0, step:0.01, interval: 10},
    motion: function motion(points, data) {
        points.forEach(function (item, index) {
            var n =  (perlin.noise(data.value + index * 10))
            var d =  -5+ n*10
            points[index] += d
            data.value += data.step
        })
    }
})

stage.add(curve)


function tick(){
    stage.update()
    requestAnimationFrame(tick)
}

tick()

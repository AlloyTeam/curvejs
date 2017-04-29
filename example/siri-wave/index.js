import curvejs from  '../../src/index.js'
import SiriWave from  './siri-wava.js'
const  { Stage, SmoothCurve, motion } = curvejs

let canvas = document.getElementById('myCanvas')
let stage = new Stage(canvas)

const rd = function() {
    return -2 + Math.random() * 2
}


let curve = new SmoothCurve({
    color: '#4EEE94',
    visionMax:10,
    visionInterval:10
})

stage.add(curve)



var sw = new SiriWave({
    width: 640,
    height: 400,
    speed:0.4,
    noise:50
});

var range = document.getElementById('range');


function tick() {
    sw.tick()
    sw.noise = range.value
    curve.points = sw.list.slice(0)
    stage.update()

    requestAnimationFrame(tick)
}

tick()

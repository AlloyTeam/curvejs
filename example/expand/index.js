import curvejs from  '../../src/index.js'

const  { Stage, Curve, motion } = curvejs

let canvas = document.getElementById('myCanvas')
let stage = new Stage(canvas)

const rd = function() {
    return -2 + Math.random() * 2
}

let curve = new Curve({
    color: '#00FF00',
    points: [277, 327, 230, 314, 236, 326, 257, 326],
    data: [rd(), rd(), rd(), rd(), rd(), rd(), rd(), rd()],
    motion: motion.expand,
    data: { value: 1, step: 0.002 }
})

stage.add(curve)


function tick(){
    stage.update()
    requestAnimationFrame(tick)
}

tick()

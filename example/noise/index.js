import curvejs from  '../../src/index.js'

const  { Stage, Curve, motion, color } = curvejs

let stage = new Stage(document.getElementById('myCanvas'))

let curve = new Curve({
    color: '#00FF00',
    data: {value: 0, step: 0.01, width: 600, height: 400},
    motion: motion.noise
})

stage.add(curve)

let percent = 0,
    step = 1

setInterval(()=>{

    curve.color = color.lerp('red', 'green', percent += step)

    if(percent === 0 || percent === 100) step *= -1

},30)


function tick(){
    stage.update()
    requestAnimationFrame(tick)
}

tick()

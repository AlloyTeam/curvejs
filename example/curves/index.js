import util from  '../../src/util.js'
import curvejs from  '../../src/index.js'

const  { Stage, Curve, motion } = curvejs

var lineCount = 5,
    canvas = document.getElementById('myCanvas'),
    random = util.random,
    randomColor = util.randomColor,
    randomSpeed = util.randomSpeed,
    stage = new Stage(canvas)

function generatePosition() {
    for (var i = 0; i < lineCount; i++) {
        stage.add(new Curve({
            points: [random(10, canvas.width - 10), random(10, canvas.height - 10), random(10, canvas.width - 10), random(10, canvas.height - 10), random(10, canvas.width - 10), random(10, canvas.height - 10), random(10, canvas.width - 10), random(10, canvas.height - 10)],
            color: randomColor(),
            motion: motion.circle,
            data: { angle: 0, step: Math.PI / 100 }
        }))
    }
}


function tick(){
    stage.update()
    requestAnimationFrame(tick)
}

;(function main(){
    generatePosition()
    tick()
})()
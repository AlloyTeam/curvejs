import curvejs from  '../../src/index.js'

const  { Stage, Curve, motion, SproutCurve } = curvejs

let canvas = document.getElementById('myCanvas')
canvas.width = window.innerWidth
canvas.height = window.innerHeight
let stage = new Stage(canvas)


let curve = new SproutCurve({
    color: '#65ffff'
})

const rect = canvas.getBoundingClientRect()
let currentX = null,
    currentY = null,
    isMouseDown = false

canvas.addEventListener('mousedown',(evt)=>{
    isMouseDown = true
    currentX = evt.clientX -rect.left
    currentY = evt.clientY - rect.top

},false)

document.addEventListener('mousemove',(evt)=>{
    if(isMouseDown) {
        currentX = evt.clientX - rect.left
        currentY = evt.clientY - rect.top
    }
    evt.preventDefault()
},false)


document.addEventListener('mouseup',()=>{
    isMouseDown = false
    currentX = null
    currentY = null
},false)


stage.add(curve)

curve.addSeed(300,300)
curve.addSeed(300,300)
curve.addSeed(300,300)
curve.addSeed(300,300)
curve.addSeed(300,300)
curve.addSeed(300,300)

function tick(){
    if(currentX !== null) {
        curve.addSeed(currentX, currentY, 1, 1)
    }
    stage.update(true)
    requestAnimationFrame(tick)
}

tick()


setTimeout(()=>{

    document.getElementById('tip').style.opacity = 0;
},5000)
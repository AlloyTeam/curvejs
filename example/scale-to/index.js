import curvejs from  '../../src/index.js'

const  { Stage, Curve, motion } = curvejs

let canvas = document.getElementById('myCanvas')
let stage = new Stage(canvas)

let data = [
    [75,40,75,37,70,25,50,25],
    [50,25,20,25,20,62.5,20,62.5],
    [20,62.5,20,80,40,102,75,120],
    [75,120,110,102,130,80,130,62.5],
    [130,62.5,130,62.5,130,25,100,25],
    [100,25,85,25,75,37,75,40]
]
const position = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0 ]
const colors = ['#22CAB3','#22CAB3','#22CAB3','#22CAB3','#22CAB3','#22CAB3','#22CAB3','#FF7784','#FF7784','#FF7784']
const rd = function() {
    return -2 + Math.random() * 2
}

const rdX = function() {
    return 10 + Math.floor(Math.random() * (canvas.width - 20 + 1))
}

const rdY = function() {
    return 10 + Math.floor(Math.random() * (canvas.height - 20 + 1))
}

const motionFn = function motion(points, data) {
    points.forEach((item, index)=> {
        points[index] += data[index]


        if (index % 2 === 0) {
            if (points[index] + this.x < 0) {
                points[index] = -this.x
                data[index] *= -1
            }

            if (points[index] + this.x > canvas.width) {
                points[index] = canvas.width - this.x
                data[index] *= -1
            }
        } else {
            if (points[index] + this.y < 0) {
                points[index] = -this.y
                data[index] *= -1
            }

            if (points[index] + this.y > canvas.height) {
                points[index] = canvas.height - this.y
                data[index] *= -1
            }
        }
    })
}


function dance(child, scale) {

    child.scaleTo(scale, 2000, {
        center: [85,80],
        end: function () {
            dance(this, scale === 2 ? 0.5 : 2)
        }
    })
}


;(function main(){
    for(let i = 0 ;i < 6; i++) {

        let curve = new Curve({
            x:200,
            y:100,
            color: colors[i],
            points:data[i]
        })
        stage.add(curve)
    }

    stage.children.forEach((child)=>{
        dance(child, 2)
    })

})()

function tick(){
    stage.update()
    requestAnimationFrame(tick)
}

tick()

import curvejs from  '../../src/index.js'

const  { Stage, Curve, motion, SmoothCurve } = curvejs

let canvas = document.getElementById('myCanvas')
let stage = new Stage(canvas)

const rd = function() {
    return -2 + Math.random() * 2
}


let curve = new SmoothCurve({
    color: '#00FF00',
    points: [100,100,200,100,300,350,300,250,400,250,300,250,400,250],
    data: [rd(), rd(), rd(), rd(), rd(), rd(), rd(), rd(), rd(), rd(), rd(), rd(), rd(), rd()],
    motion: function motion(points, data) {
        points.forEach(function (item, index) {
            points[index] += data[index]

            if (points[index] < 0) {
                points[index] = 0
                data[index] *= -1
            }
            if (index % 2 === 0) {
                if (points[index] > canvas.width) {
                    points[index] = canvas.width
                    data[index] *= -1
                }
            } else {
                if (points[index] > canvas.height) {
                    points[index] = canvas.height
                    data[index] *= -1
                }
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

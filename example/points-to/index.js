import curvejs from  '../../src/index.js'

const  { Stage, Curve, motion } = curvejs

let canvas = document.getElementById('myCanvas')
let stage = new Stage(canvas)

const data = [
    [70,70,12,76,12,123,70,128],
    [25,68,23,140,80,140,74,100],
    [73,62,72,90,75,110,93,134],
    [21,62,21,62,21,128,21,128],
    [21,128,17,96,17,68,65,60],
    [12,58,41,132,61,132,96,58],
    [44,104,112,52,-20,82,77,136],
    [52,48,53,48,54,49,52,48],
    [8,175,24,204,60,197,56,74],
    [81,72,17,42,105,145,41,120]
]
const position = [0,0,60,0,60,0,145,0,145,0,210,10,280,-5,350,0,350,0,400,0 ]
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





function dance(){
    stage.children.forEach((child ,index)=>{
        child.pointsTo(data[index],2000,{
            end:function(){
                setTimeout(()=>{
                    this.play()
                },3000)
            }
        })
    })


}


;(function main(){
    for(let i = 0 ;i < 10; i++) {

        let curve = new Curve({
            x: position[i * 2] + 30,
            y: position[i * 2 + 1] + 80,
            color: colors[i],
            points: [rdX(), rdY(), rdX(), rdY(), rdX(), rdY(), rdX(), rdY()],
            motion: motionFn,
            data: [rd(), rd(), rd(), rd(), rd(), rd(), rd(), rd()],
        })
        stage.add(curve)
    }

    setTimeout(()=>dance(),2000)
    setInterval(()=>dance(),10000)
})()

function tick(){
    stage.update()
    requestAnimationFrame(tick)
}

tick()

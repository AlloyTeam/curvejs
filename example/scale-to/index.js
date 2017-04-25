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
            color: 'red',
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

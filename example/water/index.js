import curvejs from  '../../src/index.js'

const  { Stage, Curve, motion, SmoothCurve, perlin } = curvejs

let canvas = document.getElementById('myCanvas')
let stage = new Stage(canvas)
let bgImg = new Image()

const rd = function() {
    return -2 + Math.random() * 2
}


const map = function (value, start, end, valueStart, valueEnd) {
    return valueStart + (valueEnd - valueStart) * value / (end - start)
}

let curve = new SmoothCurve({
    color: '#ffffff',
    size: 3,
    points: [99,219,110,219,120,222,130,222,137,221,147,221,165,221,175,221,189,224,199,224,216,227,226,227,240,223,250,223,267,224,277,224,290,219],
    data: { value:0, step:0.001, interval: 10},
    motion: function motion(points, data) {
        points.forEach((item, index)=> {
            if (index % 2 === 1 && index !== 1 && index !== points.length - 1) {
                points[index] = map(perlin.noise(data.value + data.interval * index), 0, 1, this.copyPoints[index] - 12, this.copyPoints[index] - 5 + 12)
                data.value += data.step
            }
        })
    },
    visionMax:40,
    //disableVision:true,
    //debug:true,
    beforeDraw(ctx){
        ctx.drawImage(bgImg, 0, 0)
    },
    afterDraw(ctx){
        //draw water
        ctx.save()
        ctx.beginPath()
        ctx.fillStyle = '#00ffff'
        ctx.globalAlpha = 0.7

        var points = this.points

        ctx.beginPath();
        ctx.moveTo(points[0], points[1]);
        for (let i = 2, len = points.length; i < len; i += 2) {
            if (i === points.length - 4) {
                ctx.quadraticCurveTo(points[i], points[i + 1], points[i + 2], points[i + 3]);
            } else {
                ctx.quadraticCurveTo(points[i], points[i + 1], (points[i] + points[i + 2]) / 2, ((points[i + 1] + points[i + 3]) / 2));
            }
        }

        ctx.bezierCurveTo(280, 286, 256, 289,195,286)

        ctx.bezierCurveTo(126, 289, 113, 289, points[0], points[1])
        ctx.fill()
        ctx.restore()

    }
})


bgImg.onload = function(){
    stage.add(curve)
}

bgImg.src = './bg.png'

function tick(){
    stage.update()
    requestAnimationFrame(tick)
}

tick()
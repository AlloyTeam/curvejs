/**
 * Created by dntzhang on 2017/4/26.
 */
import perlin from  './noise.js'


class SproutCurve {
    constructor(option) {
        this.seeds = []
        this.initAlpha = 0.2
        this.startLife = 250
        this.noise = {value: 0, step: 0.0008, scale: 2, interval: 10}
        this.color = option.color || '#65ffff'
    }

    addSeed(x, y, vx, vy) {
        this.seeds.push({
            x: x,
            y: y,
            vx: vx,
            vy: vy,
            px: x,
            py: y,
            life: this.startLife
        })

    }

    sprout() {

        while (this.seeds.length && this.seeds[0].life === 0) {
            this.seeds.shift();
        }
        let dx = 0,
            dy = 0
        for (let i = 0, len = this.seeds.length; i < len; i++) {
            dx = dy = 0
            let seed = this.seeds[i]
            let nv = perlin.noise(this.noise.value + i * this.noise.interval) * Math.PI * 5
            this.noise.value += this.noise.step

            dx += this.noise.scale * Math.cos(nv)
            dy += this.noise.scale * Math.sin(nv)
            seed.life--


            let nx = seed.x + dx
            let ny = seed.y + dy


            seed.px = seed.x
            seed.py = seed.y

            seed.x = nx
            seed.y = ny
            //seed.x+=seed.vx*10
            //seed.y+=seed.vy*10

        }
    }


    draw(ctx) {

        this.sprout()
        if (this.seeds.length === 0)return

        ctx.globalAlpha = this.initAlpha * (this.seeds[this.seeds.length - 1].life / this.startLife)
        this.points = []

        for (let i = 0, len = this.seeds.length; i < len; i++) {
            this.points.push(this.seeds[i].x, this.seeds[i].y)
        }
        let points = this.points
        let len = points.length
        if (len > 5) {
            ctx.beginPath();
            ctx.globalCompositeOperation = 'lighter'
            ctx.strokeStyle = this.color

            ctx.moveTo(points[0], points[1]);
            for (let i = 2; i < len; i += 2) {
                if (i === points.length - 4) {
                    ctx.quadraticCurveTo(points[i], points[i + 1], points[i + 2], points[i + 3]);
                } else {
                    ctx.quadraticCurveTo(points[i], points[i + 1], (points[i] + points[i + 2]) / 2, ((points[i + 1] + points[i + 3]) / 2));
                }
            }

            ctx.stroke()
        }
    }
}

export default SproutCurve
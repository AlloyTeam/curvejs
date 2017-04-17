import motion from './motion/index.js'

class Curve {
    constructor(option) {
        this.points = option.points || []
        this.color = option.color || 'black'
        this.x = option.x || 0
        this.y = option.y || 0
        this.vision = option.vision || []
        this.visionMax = 640
        this.visionInterval = option.visionInterval || 10

        this._preDate = Date.now()
        this._now = new Date()

        this.data = option.data


        this.copyPoints = this.points.slice(0)
        this.motion = option.motion|| motion.dance

        this._initVision(option.visionCount || 80)
    }

    _initVision() {
        var i = 0;
        for (; i < 80; i++) {
            this.tick(true)
        }
    }

    tick(tickSelf) {
        this._now = Date.now()
        if (this._now - this._preDate > this.visionInterval || tickSelf) {

            this.vision.push.apply(this.vision, this.points)
            if (this.vision.length > this.visionMax) {
                this.vision.splice(0, 8)
            }
            this._preDate = this._now
        }

        this.motion.call(this,this.points, this.data)
    }

    draw(ctx) {
        this.tick()
        ctx.save()
        ctx.translate(this.x, this.y)
        ctx.globalAlpha = 1
        var points = this.points
        ctx.beginPath()
        ctx.strokeStyle = this.color
        ctx.moveTo.call(ctx, points[0], points[1])
        ctx.bezierCurveTo.call(ctx, points[2], points[3], points[4], points[5], points[6], points[7])
        ctx.stroke()

        var vision = this.vision

        var i = 0, len = vision.length
        for (; i < len; i += 8) {
            ctx.globalAlpha = i / this.visionMax * 0.1
            ctx.beginPath()
            ctx.moveTo.call(ctx, vision[i], vision[i + 1])
            ctx.bezierCurveTo.call(ctx, vision[i + 2], vision[i + 3], vision[i + 4], vision[i + 5], vision[i + 6], vision[i + 7])
            ctx.stroke()

        }
        ctx.restore()
    }

    clone() {

    }
}


export default Curve

class QCurve {
    constructor(option) {
        this.points = option.points || [0, 0, 0, 0, 0, 0]
        this.color = option.color || 'black'
        this.x = option.x || 0
        this.y = option.y || 0
        this.vision = option.vision || []
        this.visionMax = 560
        this.visionInterval = option.visionInterval || 10

        this._preDate = Date.now()
        this._now = new Date()

        this.data = option.data

        this._noop = function () {
        }
        this._ease = function (value) {
            return value
        }
        this._targetPoints = null

        this.copyPoints = this.points.slice(0)
        this.motion = option.motion || this._noop

        this.visionAlpha = option.visionAlpha === void 0 ? 0.2 : option.visionAlpha

        if (option.initVision === void 0 || option.initVision) {
            this._initVision(option.visionCount || 80)
        }
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
            this.vision.push(this.color)

            if (this.vision.length > this.visionMax) {
                this.vision.splice(0, 7)
            }
            this._preDate = this._now
        }

        if (!this.pauseMotion) {
            this.motion.call(this, this.points, this.data)
        }

        if (this._targetPoints) {
            this._pointsTo()
        }
    }

    pause() {
        this.pauseMotion = true
    }

    play() {
        this.pauseMotion = false
    }

    draw(ctx) {
        this.tick()
        ctx.save()
        ctx.translate(this.x, this.y)
        ctx.globalAlpha = 1
        ctx.strokeStyle = this.color
        var points = this.points
        ctx.beginPath()
        ctx.moveTo.call(ctx, points[0], points[1])
        ctx.quadraticCurveTo.call(ctx, points[2], points[3], points[4], points[5])
        ctx.stroke()

        var vision = this.vision

        var i = 0, len = vision.length
        for (; i < len; i += 7) {
            ctx.globalAlpha = i / this.visionMax * this.visionAlpha
            ctx.strokeStyle = vision[i + 6]
            ctx.beginPath()
            ctx.moveTo.call(ctx, vision[i], vision[i + 1])
            ctx.bezierCurveTo.call(ctx, vision[i + 2], vision[i + 3], vision[i + 4], vision[i + 5])
            ctx.stroke()

        }
        ctx.restore()
    }



}

export default Curve
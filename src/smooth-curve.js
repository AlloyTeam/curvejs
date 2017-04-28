
class SmoothCurve {
    constructor(option) {
        this.points = option.points || [0, 0, 0, 0, 0, 0]
        this.color = option.color || 'black'
        this.x = option.x || 0
        this.y = option.y || 0
        this.vision = option.vision || []
        this.visionMax = option.visionMax !== void 0 ? option.visionMax : 80
        this.visionInterval = option.visionInterval || 10
        this.disableVision = option.disableVision
        this._preDate = Date.now()
        this._now = new Date()
        this.debug = option.debug
        this.size = option.size || 1
        this.data = option.data

        const noop = function () {
        }
        this._ease = function (value) {
            return value
        }
        this._targetPoints = null

        this.copyPoints = this.points.slice(0)
        this.motion = option.motion || noop

        this.visionAlpha = option.visionAlpha === void 0 ? 0.2 : option.visionAlpha

        if (option.initVision === void 0 || option.initVision) {
            this._initVision(option.visionCount || 80)
        }

        this.beforeDraw = option.beforeDraw || noop
        this.afterDraw = option.afterDraw || noop
    }

    _initVision() {
        var i = 0;
        for (; i < 80; i++) {
            this.tick(true)
        }
    }

    tick(tickSelf) {
        if(!this.disableVision) {
            this._now = Date.now()
            if (this._now - this._preDate > this.visionInterval || tickSelf) {

                this.vision.push(this.points.slice(0))


                if (this.vision.length > this.visionMax) {
                    this.vision.splice(0, 1)
                }
                this._preDate = this._now
            }
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

        this.beforeDraw.call(this, ctx)

        ctx.save()
        ctx.translate(this.x, this.y)
        ctx.lineWidth = this.size
        ctx.globalAlpha = 1
        ctx.strokeStyle = this.color
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
        ctx.stroke();

        if (this.debug) {
            ctx.beginPath();
            ctx.globalAlpha = 0.3
            ctx.moveTo(points[0], points[1]);
            for (let i = 2, len = points.length; i < len; i += 2) {
                ctx.lineTo(points[i], points[i + 1]);
            }
            ctx.stroke();
        }

        var vision = this.vision
        for (let i = 0, len = vision.length; i < len; i++) {
            ctx.globalAlpha = i / this.visionMax * this.visionAlpha
            let vp = vision[i]
            ctx.beginPath();
            ctx.moveTo(vp[0], vp[1]);
            for (let i = 2, vlen = vp.length; i < vlen; i += 2) {
                if (i === points.length - 4) {
                    ctx.quadraticCurveTo(vp[i], vp[i + 1], vp[i + 2], vp[i + 3]);
                } else {
                    ctx.quadraticCurveTo(vp[i], vp[i + 1], (vp[i] + vp[i + 2]) / 2, ((vp[i + 1] + vp[i + 3]) / 2));
                }
            }
            ctx.stroke();
        }
        ctx.restore()

        this.afterDraw.call(this, ctx)
    }
}

export default SmoothCurve
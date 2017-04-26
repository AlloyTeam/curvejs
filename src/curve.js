
class Curve {
    constructor(option) {
        this.points = option.points || [0,0,0,0,0,0,0,0]
        this.color = option.color || 'black'
        this.x = option.x || 0
        this.y = option.y || 0
        this.vision = option.vision || []
        this.visionMax = 720
        this.visionInterval = option.visionInterval || 10

        this._preDate = Date.now()
        this._now = new Date()

        this.data = option.data

        this._noop = function (){}
        this._ease = function (value){ return value }
        this._targetPoints = null

        this.copyPoints = this.points.slice(0)
        this.motion = option.motion|| this._noop

        this.visionAlpha = option.visionAlpha === void 0 ? 0.2 :option.visionAlpha

        if(option.initVision === void 0 || option.initVision ) {
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
                this.vision.splice(0, 9)
            }
            this._preDate = this._now
        }

        if(!this.pauseMotion) {
            this.motion.call(this, this.points, this.data)
        }

        if(this._targetPoints){
            this._pointsTo()
        }
    }

    pause(){
        this.pauseMotion = true
    }

    play(){
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
        ctx.bezierCurveTo.call(ctx, points[2], points[3], points[4], points[5], points[6], points[7])
        ctx.stroke()

        var vision = this.vision

        var i = 0, len = vision.length
        for (; i < len; i += 9) {
            ctx.globalAlpha = i / this.visionMax * this.visionAlpha
            ctx.strokeStyle = vision[i + 8]
            ctx.beginPath()
            ctx.moveTo.call(ctx, vision[i], vision[i + 1])
            ctx.bezierCurveTo.call(ctx, vision[i + 2], vision[i + 3], vision[i + 4], vision[i + 5], vision[i + 6], vision[i + 7])
            ctx.stroke()

        }
        ctx.restore()
    }

    pointsTo(points, time, option){
        this.pause()
        let ps = this.points
        this._targetPoints = points
        this._pto = option
        this._ptStart = option.start || this._noop
        this._ptProgress = option.progress || this._noop
        this._ptEnd = option.end || this._noop
        this._ptEase = option.ease || this._ease
        this._ptTime = time
        this._ptStartTime = Date.now()
        this._ptCopyPoints = ps.slice(0)

        this._ptDistance = [points[0] -  ps[0],points[1] -  ps[1],points[2] -  ps[2],points[3] -  ps[3],points[4] -  ps[4],points[5] -  ps[5],points[6] -  ps[6],points[7] -  ps[7]]

        this._ptStart.call(this, 0)
    }

    translatePoints(xy, time, option) {

        xy = Object.assign({x: 0, y: 0}, xy)
        let ps = this.points
        this.pointsTo([ps[0] + xy.x, ps[1] + xy.y, ps[2] + xy.x, ps[3] + xy.y, ps[4] + xy.x, ps[5] + xy.y, ps[6] + xy.x, ps[7] + xy.y], time, option)

    }

    scaleTo(scale, time, option) {
        let scaleX = 1,
            scaleY = 1
        if (typeof scale === 'number') {
            scaleX = scaleY = scale
        } else {
            (scale.scaleX !== void 0) && (scaleX = scale.scaleX)
            (scale.scaleY !== void 0) && (scaleY = scale.scaleX)
        }

        let points = this.points
        let centerX = (option.center !== void 0) ? option.center[0] : (points[0] + points[6]) / 2
        let centerY = (option.center !== void 0) ? option.center[1]  : (points[1] + points[7]) / 2


        this.pointsTo(
            [scaleX * (points[0] - centerX) + centerX,
                scaleY * (points[1] - centerY) + centerY,
                scaleX * (points[2] - centerX) + centerX,
                scaleY * (points[3] - centerY) + centerY,
                scaleX * (points[4] - centerX) + centerX,
                scaleY * (points[5] - centerY) + centerY,
                scaleX * (points[6] - centerX) + centerX,
                scaleY * (points[7] - centerY) + centerY], time, option)

    }

    rotateTo(rotation, time, option) {


    }


    _pointsTo(){

        let ps = this.points
        let dt = Date.now() - this._ptStartTime
        if(dt < this._ptTime) {
            let progress = dt / this._ptTime
            ps.forEach((v,i)=>{
                ps[i] =this._ptCopyPoints[i] + this._ptDistance[i] * this._ptEase(progress)
            })
            this._ptProgress.call(this, progress)
        }else{
            ps = this._targetPoints.slice(0)
            this._targetPoints = null
            this._ptEnd.call(this, 1)
        }
    }

    colorTo(){

    }

    clone() {
    }
}

export default Curve
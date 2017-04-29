
export default class SiriWave {
    constructor(opt) {
        this.opt = opt || {};

        this.K = 2;
        this.F = 6;
        this.speed = this.opt.speed || 0.1;
        this.noise = this.opt.noise || 0;
        this.phase = this.opt.phase || 0;

        this.width = this.opt.width || 320;
        this.height = this.opt.height || 100;

        this.list = []
    }

    _globalAttenuationFn(x) {
        //http://www.wolframalpha.com/input/?i=pow(2*4%2F(2*4%2Bpow(x,4)),2*2)
        return Math.pow(this.K * 4 / (this.K * 4 + Math.pow(x, 4)), this.K * 2);
    }

    _drawLine(attenuation) {
        var x, y;
        this.list.length = 0
        for (var i = -this.K; i <= this.K; i += 0.1) {
            x = this.width * ((i + this.K) / (this.K * 2));
            y = this.height / 2 + this.noise * this._globalAttenuationFn(i) * (1 / attenuation) * Math.sin(this.F * i - this.phase);
            this.list.push( x,y)
        }
    }

    tick() {
        this.phase = (this.phase + this.speed) % (Math.PI * 64);
        this._drawLine(1);
    }
}
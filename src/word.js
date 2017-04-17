import wordData from './word-data.js'
import Curve from './curve.js'
import Group from './group.js'

class Word extends Group {
    constructor(word, option) {
        super()

        option = Object.assign({
            x:0,y:0,color:'black'
        },option)

        this.x = option.x
        this.y = option.y
        this.color = option.color
        this.word = word
        this.data = option.data
        this.motion = option.motion

        this.points = wordData[word]

        this._init()
    }

    _init() {
        this.points.forEach((item)=> {

                this.add(new Curve({
                    x:this.x,
                    y:this.y,
                    points: item,
                    color:this.color,
                    data:this.data,
                    motion:this.motion
                }))
        })
    }

}

export default Word
import Group from  './group.js'

class Stage extends Group {
    constructor(width, height, renderTo) {
        super()

        if (arguments.length === 1) {
            this.canvas = width
            this.ctx = this.canvas.getContext('2d')
            this.width = this.canvas.width
            this.height = this.canvas.height
        } else if (arguments.length === 3) {
            this.canvas = document.createElement('canvas')
            this.canvas.width = width
            this.canvas.height = height
            this.width = width
            this.height = height
            this.ctx = this.canvas.getContext('2d')
            document.querySelector(renderTo).appendChild(this.canvas)
        }
    }

    update(notClear) {
        if(!notClear){
            this.ctx.clearRect(0, 0, this.width, this.height)
        }
        this.children.forEach((child)=> {
            child.draw(this.ctx)
        })
    }

    addExistLine(process) {
    }

    sameAs(index) {
    }
}


export default Stage
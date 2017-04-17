class Group {
    constructor() {
        this.children = []
    }

    add(line) {
        this.children.push(line)
    }

    remove(line) {
        var i = 0,
            len = this.children.length
        for (; i < len; i++) {

            if (line === this.children[i]) {

                this.children.splice(i, 1)
                break
            }
        }
    }

    draw(ctx){
        this.children.forEach(function(child) {
            child.draw(ctx)
        })
    }
}

export default Group
import dance from './dance.js'
import move from './move.js'
import rotate from './rotate.js'
import path from './path.js'
import to from './to.js'
import line from './line.js'
import circle from './circle.js'
import expand from './expand.js'
import noise from './noise.js'

export default {
    dance,
    move,
    rotate,
    to,
    line,
    circle,
    close: path.close,
    open: path.open,
    expand,
    noise
}
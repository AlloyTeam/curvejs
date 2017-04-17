/**
 * close or open path motion.
 *
 * @param {points}
 */

import vector2 from '../vector2.js'

function open(points) {
    var v = vector2.n(points[0] - points[6], points[1] - points[7])

    points[0] += v[0]
    points[1] += v[1]

    points[6] -= v[0]
    points[7] -= v[1]

}

function close(points) {
    var v = vector2.n(points[0] - points[6], points[1] - points[7])

    points[0] -= v[0]
    points[1] -= v[1]

    points[6] += v[0]
    points[7] += v[1]

}

function auto(points){


}


export default {
    close,
    open,
    auto
}
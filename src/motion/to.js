/**
 * to motion.
 *
 * @param {points}
 * @param {data}
 *      data rule example:
 *      [100,200, 150, 333, 200,11, 1, 1]
 */
import vector2 from '../vector2.js'

export default function to(points, target) {
    var va1 = [points[2] - points[0], points[3] - points[1]]
    var va2 = [points[4] - points[2], points[5] - points[3]]
    var va3 = [points[6] - points[4], points[7] - points[5]]

    var vb1 = [target[2] - target[0], target[3] - target[1]]
    var vb2 = [target[4] - target[2], target[5] - target[3]]
    var vb3 = [target[6] - target[4], target[7] - target[5]]


    var v1 = vector2.n((vb1[0] - va1[0]), (vb1[1] - va1[1]))
    points[0] -= v1[0]
    points[1] -= v1[1]

    var v2 = vector2.n((vb2[0] - va2[0]), (vb2[1] - va2[1]))
    points[4] += v2[0]
    points[5] += v2[1]

    var v3 = vector2.n((vb3[0] - va3[0]), (vb3[1] - va3[1]))
    points[6] += v3[0]
    points[7] += v3[1]
}


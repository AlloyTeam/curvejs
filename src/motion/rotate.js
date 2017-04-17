/**
 * rotate motion.
 *
 * @param {points}
 * @param {data}
 *      data rule example:
 *      Math.PI/100
 */

function _rotate(x1, y1, x2, y2, theta, index, points) {
    var v = {x: x1 - x2, y: y1 - y2};
    var R = [[Math.cos(theta), -Math.sin(theta)], [Math.sin(theta), Math.cos(theta)]];

    points[index] = x2 + R[0][0] * v.x + R[0][1] * v.y
    points[index + 1] = y2 + R[1][0] * v.x + R[1][1] * v.y

}

export default function rotate(points, angle) {
    var centerX = (points[0] + points[6]) / 2
    var centerY = (points[1] + points[7]) / 2
    _rotate(points[0], points[1], centerX, centerY, angle, 0, points)
    _rotate(points[2], points[3], centerX, centerY, angle, 2, points)
    _rotate(points[4], points[5], centerX, centerY, angle, 4, points)
    _rotate(points[6], points[7], centerX, centerY, angle, 6, points)

}
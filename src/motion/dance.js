/**
 * dance motion, spin around.
 *
 * @param {points}
 * @param {data}
 *      data rule example:
 *      { angle : 0, r : 5 , step : Math.PI / 50 }
 */
export default function (points, data) {
    var pre = this.copyPoints,
        theta = data.angle,
        r = data.r

    var R = [[Math.cos(theta), -Math.sin(theta)], [Math.sin(theta), Math.cos(theta)]];
    points[0] = pre[0] + R[0][0] * r
    points[1] = pre[1] + R[1][0] * r
    points[2] = pre[2] + R[0][0] * r
    points[3] = pre[3] + R[1][0] * r
    points[4] = pre[4] + R[0][0] * r
    points[5] = pre[5] + R[1][0] * r
    points[6] = pre[6] + R[0][0] * r
    points[7] = pre[7] + R[1][0] * r

    data.angle += data.step
}
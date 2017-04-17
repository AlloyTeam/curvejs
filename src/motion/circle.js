export default function circle(points, data){
    var R = [[Math.cos(data.angle), -Math.sin(data.angle)], [Math.sin(data.angle), Math.cos(data.angle)]];

    this.data.angle += data.step

    points[0] = points[0] + R[0][0]
    points[1] = points[1] + R[1][0]
    points[6] = points[6] + R[0][0]
    points[7] = points[7] + R[1][0]
}
function sliceBezier(p1,cp1,cp2,p2, t){
    var x1= p1.x,
        y1=p1.y,
        x2= cp1.x,
        y2=cp1.y,
        x3= cp2.x,
        y3=cp2.y,
        x4= p2.x,
        y4=p2.y;


    var x12 = (x2-x1)*t+x1
    var y12 = (y2-y1)*t+y1

    var x23 = (x3-x2)*t+x2
    var y23 = (y3-y2)*t+y2

    var x34 = (x4-x3)*t+x3
    var y34 = (y4-y3)*t+y3

    var x123 = (x23-x12)*t+x12
    var y123 = (y23-y12)*t+y12

    var x234 = (x34-x23)*t+x23
    var y234 = (y34-y23)*t+y23

    var x1234 = (x234-x123)*t+x123
    var y1234 = (y234-y123)*t+y123

    return [x1, y1, x12, y12, x123, y123, x1234, y1234]
}


export default function (points, data) {
    data.value -= data.step
    if(data.value <0)data.value=0
    var part1OfBezier = sliceBezier(
        {x: this.copyPoints[0], y:  this.copyPoints[1]},
        {x:  this.copyPoints[2], y:  this.copyPoints[3]},
        {x:  this.copyPoints[4], y:  this.copyPoints[5]},
        {x:  this.copyPoints[6], y:  this.copyPoints[7]},data.value)

    points.forEach((value,index)=>{
        points[index] = part1OfBezier[index]
    })
}
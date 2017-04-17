function n(x, y) {
    var sum = x * x + y * y
    if(sum ===0) return [0,0]
    var len = Math.sqrt(sum)
    return [x / len, y / len]
}

function sl(x, y) {
    return  x * x + y * y
}


export default {
    n,
    sl
}
/**
 * noise motion.
 *
 * @param {points}
 * @param {data}
 *      data rule example:
 *      { value : 0, step : 0.005 ,width : 600, height : 400}
 */
import perlin from  '../noise.js'

export default function (points, data) {
    data.value += data.step

    points[0] = data.width * perlin.noise(data.value + 15)
    points[1] = data.height * perlin.noise(data.value + 25)
    points[2] = data.width * perlin.noise(data.value + 35)
    points[3] = data.height * perlin.noise(data.value + 45)
    points[4] = data.width * perlin.noise(data.value + 55)
    points[5] = data.height * perlin.noise(data.value + 65)
    points[6] = data.width * perlin.noise(data.value + 75)
    points[7] = data.height * perlin.noise(data.value + 85)

}
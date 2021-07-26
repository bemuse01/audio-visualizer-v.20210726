import PUBLIC_METHOD from '../../../method/method.js'
import Spline from '../../../lib/cubic-spline.js'

export default {
    setPosition({geometry, idx, degree}){
        const array = geometry.attributes.position.array


        for(let i = 0; i < 2; i++){
            const dir = i === 0 ? 1 : -1

            for(let j = 0; j < 2; j++){
                const index = (i * 2 + j) * 3
                const deg = idx * degree + j * degree

                const x = Math.cos(deg * RADIAN) * (200 + 50 * dir) 
                const y = Math.sin(deg * RADIAN) * (200 + 50 * dir) 

                array[index] = x
                array[index + 1] = y
            }
        }
    },
    createStepAudioBuffer({offset, display, step}){
        const temp = []

        for(let i = 0; i < display; i++){
            temp.push(offset[i * step])
        }

        return temp
    },
    createAudioBuffer({sample, index, smooth}){
        const len = sample.length 
        let temp = []

        const xs = index
        const ys = sample
        const spline = new Spline(xs, ys)
        
        for(let i = 0; i < len; i++){
            temp.push(spline.at(i * smooth))
        }

        const avg = temp.reduce((x, y) => x + y) / len
        temp = temp.map(e => Math.max(1, e - avg))
        // temp = temp.map(e => PUBLIC_METHOD.normalize(Math.max(1, e - avg), 1, 100, 0, 255))

        return temp
    }
}
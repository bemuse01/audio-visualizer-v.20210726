import * as THREE from '../../../lib/three.module.js'
import PARAM from './visualizer.child.param.js'
import METHOD from './visualizer.child.method.js'
import SHADER from './visualizer.child.shader.js'

export default class{
    constructor({group}){
        this.init()
        this.create()
        this.add(group)
    }


    // init
    init(){
        this.play = true

        this.param = {
            degree: 4,
            fps: 60,
            step: 12,
            width: 500,
            height: 5,
            size: 16,
            color: 0xffffff,
            smooth: 0.14,
            distance: 250,
            gap: 5
        }

        this.count = ~~(360 / this.param.degree)

        this.index = Array.from({length: this.count}, (e, i) => i)
    }


    // add
    add(group){
        group.add(this.local)
    }

    
    // create
    create(){
        this.local = new THREE.Group()

        for(let i = 0; i < this.count; i++){
            const mesh = this.createMesh(i)

            this.local.add(mesh)
        }
    }
    createMesh(idx){
        const geometry = this.createGeometry(idx)
        const material = this.createMaterial()
        return new THREE.Mesh(geometry, material)
    }
    createGeometry(idx){
        const geometry = new THREE.PlaneGeometry()

        METHOD.setPosition({geometry, idx, ...this.param})

        return geometry
    }
    createMaterial(){
        return new THREE.MeshBasicMaterial({
            color: this.param.color,
            transparent: true
        })
    }


    // animate
    animate({audioData, context}){
        // if(!this.play) return
        if(!context) return

        const startOffset = Math.floor(1 / this.param.fps * context.sampleRate)
        const offset = audioData.slice(startOffset)
        const sample = METHOD.createStepAudioBuffer({offset, display: this.count, step: this.param.step})
        const buffer = METHOD.createAudioBuffer({sample, index: this.index, smooth: this.param.smooth})

        const {distance, gap, degree} = this.param

        this.local.children.forEach((mesh, idx) => {
            const position = mesh.geometry.attributes.position
            const array = position.array

            for(let i = 0; i < 2; i++){
                const dir = i === 0 ? -1 : 1

                for(let j = 0; j < 2; j++){
                    const index = (i * 2 + j) * 3
                    const deg = degree * idx + degree * j

                    const x = Math.cos(deg * RADIAN) * (distance + (gap + buffer[idx]) * dir)
                    const y = Math.sin(deg * RADIAN) * (distance + (gap + buffer[idx]) * dir)

                    array[index] = x
                    array[index + 1] = y
                }
            }

            position.needsUpdate = true
        })
    }
}
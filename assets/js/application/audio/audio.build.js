import * as THREE from '../../lib/three.module.js'
import METHOD from './audio.method.js'
import PARAM from './audio.param.js'

export default class{
    constructor(){
        this.init()
        this.create()
        document.addEventListener('click', () => {this.createContext(), this.play()}, false)
    }


    // init 
    init(){
        this.src = 'assets/src/LiSA - Unlasting.mp3'
        this.start = true
        this.sample = null
        this.duration = 0
        this.currentTime = 0
    }


    // create
    create(){
        this.createAudio()
    }
    createAudio(){
        this.audio = new Audio()
        this.audio.loop = true
        this.audio.src = this.src
        this.audio.volume = 0.75

        this.updateAudioCurrentTime()
    }
    createContext(){
        if(this.start){
            this.context = new AudioContext()
            
            const source = this.context.createMediaElementSource(this.audio)
            
            this.analyser = this.context.createAnalyser()
            source.connect(this.analyser)
            this.analyser.connect(this.context.destination)
            this.analyser.fftSize = PARAM.fft
            
            const bufferLength = this.analyser.frequencyBinCount
            
            this.audioData = new Uint8Array(bufferLength)
        }
    }


    // update audio current time
    updateAudioCurrentTime(){
        this.audio.addEventListener('timeupdate', () => {
            this.currentTime = this.audio.currentTime
        })
    }


    // animate
    animate(){
        if(!this.analyser) return

        this.analyser.getByteFrequencyData(this.audioData)
    }


    // play
    play(){
        if(this.start){
            this.audio.play()
            this.context.resume()
            this.duration = this.audio.duration
            this.start = false
        }
    }
}
import { SharedState } from "@vicimpa/shared-state"

const audioCtx = new (AudioContext || window['webkitAudioContext']) as AudioContext
const gainNode = audioCtx.createGain()

export const volume = new SharedState(
  +(localStorage.getItem('save-volume') || 0.5)
)

volume.onChange((e) => {
  gainNode.gain.value = e
  localStorage.setItem('save-volume', `${e}`)
  Sound.wing.play()
})

gainNode.gain.value = volume.state
gainNode.connect(audioCtx.destination)

export class Sound {
  #buffer: AudioBuffer
  static #now = 0

  constructor(src = '') {
    this.loadSound(src?.['default'] || src)
  }

  loadSound(src = '') {
    const xhr = new XMLHttpRequest()
    xhr.open('GET', src, true)
    xhr.responseType = 'arraybuffer'
    xhr.onload = () => {
      audioCtx.decodeAudioData(xhr.response)
        .then((buffer) => {
          this.#buffer = buffer
        }, console.error)
    }
    xhr.send()
  }

  play() {
    const src = audioCtx.createBufferSource()
    src.buffer = this.#buffer
    src.connect(gainNode)
    src.start(0)
    src.onended = () => {
      src.disconnect(gainNode)
      delete src.onended
    }
  }

  static test() {
    const array = [
      this.die,
      this.hit,
      this.hitPipe,
      this.point,
      this.swooshing,
      this.wing
    ]

    if(!array[this.#now])
      this.#now = 0

    array[this.#now++].play()
  }

  static die = new Sound(require('~/sound/die.wav'))
  static hit = new Sound(require('~/sound/hit.wav'))
  static hitPipe = new Sound(require('~/sound/hitPipe.wav'))
  static point = new Sound(require('~/sound/point.wav'))
  static swooshing = new Sound(require('~/sound/swooshing.wav'))
  static wing = new Sound(require('~/sound/wing.wav'))
}
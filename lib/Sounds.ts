export class Sound {
  #src = ''
  #audio: HTMLAudioElement

  constructor(src = '') {
    if (typeof src == 'object')
      this.#src = src['default']
    else
      this.#src = src

    this.#audio = new Audio(this.#src)
    this.#audio.volume = 0.3
    this.#audio.preload = 'auto'
    this.#audio.controls = false
  }

  play() {
    if(this.#audio.played) {
      this.#audio.currentTime = 0
      this.#audio.pause()
    }

    this.#audio.play()
      .catch(() => null)
  }

  static die = new Sound(require('~/sound/die.mp3'))
  static hit = new Sound(require('~/sound/hit.mp3'))
  static hitPipe = new Sound(require('~/sound/hitPipe.mp3'))
  static point = new Sound(require('~/sound/point.mp3'))
  static swooshing = new Sound(require('~/sound/swooshing.mp3'))
  static wing = new Sound(require('~/sound/wing.mp3'))
}
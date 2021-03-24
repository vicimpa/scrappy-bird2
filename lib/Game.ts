import { Bird } from "~/lib/Bird";
import { Debug } from "~/lib/Debug";
import { create } from "~/lib/Dom";
import { Pipe } from "~/lib/Pipe";
import { bind, rand, isTouchDevice } from "~/lib/Utils";
import { Sound } from "./Sounds";

export class Game {
  #pipe = create('div',
    { className: 'pane-container' })

  #road = create('div',
    { className: 'road' })

  #elem = create('div',
    { className: 'back' },
    this.#pipe, this.#road)

  #start = create('div',
    { className: 'start', onCreate: this.append })

  #end = create('div',
    { className: 'end', onCreate: this.append },
    create('p', { className: 'score' }),
    create('p', { className: 'hiscore' }),
    create('div', { className: 'space' }),
    create('button', { className: 'restart', innerText: 'Restart (Enter)', onclick: this.reset}))

  #bird = new Bird(this)
  #debug = new Debug(this)
  #pipes: Pipe[] = []

  get scoreElement() { return this.#end.querySelector('.score') as HTMLParagraphElement }
  get hiscoreElement() { return this.#end.querySelector('.hiscore') as HTMLParagraphElement }

  get showStart() { return this.#start.classList.contains('show') }
  set showStart(v) { this.#start.classList[v ? 'add' : 'remove']('show') }

  get showEnd() { return this.#end.classList.contains('show') }
  set showEnd(v) { this.#end.classList[v ? 'add' : 'remove']('show') }

  get pipeContainer() { return this.#pipe }

  get width() { return this.#pipe.offsetWidth }
  get height() { return this.#pipe.offsetHeight }

  get debug() { return this.#debug }

  work = false
  last = 0
  stage = 0
  prev = 0
  score = 0
  anim = true

  backSpeed = 5000
  roadSpeed = 1500

  readBackSpeed = 0
  readRoadSpeed = 0

  backPosition = 0
  roadPosition = 0

  get best() { 
    const b = +localStorage.getItem('flappy-bird-best')
    return isNaN(b) ? 0 : b
  }

  set best(v) {
    localStorage.setItem('flappy-bird-best', `${v}`)
  }


  get col() { 
    const b = +this.#elem.getAttribute('data-col')
    return isNaN(b) ? 0 : b
  }
  set col(v) { this.#elem.setAttribute('data-col', `${v}`) }

  get classList() { return this.#elem.classList }

  constructor(app: HTMLElement) {
    app.appendChild(this.#elem)
    this.readBackSpeed = this.width / this.backSpeed
    this.readRoadSpeed = this.width / this.roadSpeed

    const touch = (e: TouchEvent) => {
      e.preventDefault()

      if(this.stage != 3)
        this.click()
    }

    this.#pipe.addEventListener('touchstart', touch)
    this.#road.addEventListener('touchstart', touch)
    this.#start.addEventListener('touchstart', touch)

    this.#elem.addEventListener('mousedown', (e) => {
      e.preventDefault()

      if(this.stage != 3 && !isTouchDevice())
        this.click()

      addEventListener('keydown', (e) => {
        e.preventDefault()
      
        if(e.key == ' ' && this.stage != 3)
          this.click()
      
        if(e.key == 'Enter' && this.stage == 3)
          this.reset()
      })

      addEventListener('touchstart', (e) => {
        e.preventDefault()

        //if(this.stage != 3)
          //this.click()
      })
    })

    this.reset()
  }

  pipe() {
    this.#pipes.push(new Pipe(this))
  }

  addScore() {
    this.score++

    if(this.best < this.score)
      this.best = this.score
    
    Sound.point.play()
  }

  dropPipe(p: Pipe) {
    let index = this.#pipes.indexOf(p)

    if (index != -1)
      this.#pipes.splice(index, 1)

    p.elem.remove()
  }

  @bind()
  reset() {
    this.last = 0
    this.stage = 0
    this.score = 0
    this.#bird.up = 0
    this.col = rand(0, 1)
    this.#bird.col = rand(0, 12)
    

    this.anim = true
    this.#bird.reset()

    for (let p of this.#pipes.splice(0, this.#pipes.length))
      this.dropPipe(p)

    Sound.swooshing.play()
    this.pipe()
  }

  click() {
    if (this.stage == 0)
      this.stage = 1

    if(this.stage == 1)
      Sound.wing.play()

    this.#bird.click()
  }

  start() {
    if (this.work)
      return

    this.last = performance.now()
    this.work = true
    this.loop()
  }

  stop() {
    if (!this.work)
      return

    this.work = false
  }

  blick() {

  }

  @bind()
  loop() {
    const time = performance.now()
    let delta = time - this.last

    this.last = time

    if (delta > 100)
      delta = 0

    this.debug.set('Score', this.score)

    if (this.stage && this.stage < 2)
      for (let p of this.#pipes) {
        p.update(delta)
      }

    this.#bird.update(time, delta)

    if (this.stage && this.stage < 2) {
      let colize = false, pi = this.#pipes[0]

      for (let p of this.#pipes) {
        if (p.isColize(this.#bird)) {
          pi = p
          colize = true
        }
      }

      if (colize) {
        this.stage = 2
        Sound.hit.play()

        setTimeout((e) => {
          Sound.die.play()
        }, 300)

        if (this.#bird.x > pi.x) {
          if (this.#bird.y > pi.y)
            this.#bird.speed = this.#bird.minSpeed * 0.8
          else
            this.#bird.speed = 0
        } else {
          this.#bird.speed = 0
        }
      }
    }

    if(this.stage > 1) {
      let score = `Score: ${this.score}`
      if(this.scoreElement.innerHTML != score)
        this.scoreElement.innerHTML = score
  
      let hiscore = `Best: ${this.best}`
      if(this.hiscoreElement.innerHTML != hiscore)
        this.hiscoreElement.innerHTML = hiscore
    }

    if (this.stage >= 2 && this.anim)
      this.anim = false

    if (this.stage < 2 && !this.anim)
      this.anim = true

    if (this.stage == 0 && !this.showStart)
      this.showStart = true

    if (this.stage != 0 && this.showStart)
      this.showStart = false

    if (this.stage == 3 && !this.showEnd)
      this.showEnd = true

    if (this.stage != 3 && this.showEnd)
      this.showEnd = false

    if(this.stage == 3 && this.stage != this.prev)
      Sound.hit.play()

    this.prev = this.stage

    if (this.anim) {
      this.backPosition += this.readBackSpeed * delta
      this.roadPosition += this.readRoadSpeed * delta

      this.backPosition = this.backPosition % this.width
      this.roadPosition = this.roadPosition % this.width

      this.#elem.style.backgroundPositionX = `${-this.backPosition}px`
      this.#road.style.backgroundPositionX = `${-this.roadPosition}px`
      // this.#elem.style.backgroundPositionX = `${this.width * -0.0001 * (time % 6000)}px`
    }


    if (this.work)
      requestAnimationFrame(this.loop)
  }

  @bind()
  append(el: HTMLElement) {
    this.#elem.appendChild(el)
  }
}

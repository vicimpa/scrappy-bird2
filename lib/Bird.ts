import { create } from "~/lib/Dom";
import { Game } from "~/lib/Game";

const { abs } = Math
const PI5 = Math.PI / 70

export class Bird {
  #elem = create('div',
    { className: 'bird' })

  get col() { return +this.#elem.getAttribute('data-col') }
  set col(v) { this.#elem.setAttribute('data-col', `${v}`) }

  get up() { return +this.#elem.getAttribute('data-up') }
  set up(v) { this.#elem.setAttribute('data-up', `${v}`) }

  get x() { return this.#elem.offsetLeft }
  get y() { return this.#elem.offsetTop }

  set x(v) { this.#elem.style.left = `${v}px` }
  set y(v) { this.#elem.style.top = `${v}px` }

  get width() { return this.#elem.offsetWidth }
  get height() { return this.#elem.offsetHeight }

  constructor(private game: Game) {
    game.append(this.#elem)
    this.reset()
  }

  speed = 0
  maxSpeed = 40
  maxSpeed2 = 80
  minSpeed = -31

  upTime = 700
  upFly = 80
  upFlyNeed = this.upFly
  upFlyCount = 250
  upFlyLast = performance.now()
  
  reset() {
    this.x = 40
    this.speed = 0
    this.#elem.style.transform = ''
  }

  click() {
    if(this.game.stage == 1) {
      this.upFlyLast = performance.now()
      this.upFly = this.upFlyNeed / 4
      this.speed = this.minSpeed
    }
  }

  update(time = 0, delta = 0) {
    const { stage, height } = this.game
    const { upFly, upTime, height: birdHeight } = this
    const upv = (abs(time % (upFly * 3 * 2) - upFly * 3) / upFly) | 0
    const maxSpeed = stage == 1 ? this.maxSpeed : this.maxSpeed2

    if(this.upFly != this.upFlyNeed) {
      if(time - this.upFlyLast >= this.upFlyCount)
        this.upFly = this.upFlyNeed
    }

    if (this.up != upv && stage < 2)
      this.up = upv

    if (stage == 0)
      this.y = 200 + (abs(time % (upTime * 2) - upTime) / this.upTime) * 50
    
    if (stage == 1 || stage == 2) {
      const rotate = this.speed * 25 * PI5 - 10
      if(this.y < height - birdHeight)
        this.speed += 0.08 * delta
       
      if (this.speed > maxSpeed)
        this.speed = maxSpeed

      this.#elem.style.transform = `rotate(${rotate}deg)`
  
      this.y += this.speed * delta * 0.01

      if(this.y > height - birdHeight){
        this.y = height - birdHeight
        this.game.stage = 3
      }
    }
  }
}
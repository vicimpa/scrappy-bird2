import { Bird } from "~/lib/Bird";
import { create } from "~/lib/Dom";
import { Game } from "~/lib/Game";
import { rand } from "~/lib/Utils";

export class Pipe {
  #elem = create('div', 
    { className: 'pipe'})

  go = false
  score = false

  get elem() { return this.#elem }

  get width() { return this.#elem.offsetWidth }
  get height() { return this.#elem.offsetHeight }

  get x() { return this.#elem.offsetLeft }
  get y() { return this.#elem.offsetTop }

  set x(v) { this.#elem.style.left = `${v}px` }
  set y(v) { this.#elem.style.top = `${v}px` }

  padding = 60
  speed = 0
  pipeSpeed = 1400

  constructor(private game: Game) {
    game.pipeContainer.appendChild(this.#elem)
    this.speed = game.width / this.pipeSpeed
    this.x = game.width + 100
    this.y = rand(this.padding, game.height - this.padding - this.height)
  }

  isColize(bird: Bird) {
    if(this.x < bird.x && !this.score) {
      this.game.addScore()
      this.score = true
    }

    if(this.x + 6 > bird.x + bird.width)
      return false

    if(this.x + this.width - 6 < bird.x)
      return false

    if(bird.y + 4 > this.y && bird.y + bird.height - 4 < this.y + this.height)
      return false

    return true
  }

  update(delta = 0) {
    this.x -= this.speed * delta

    if(this.x < this.game.width / 2 && !this.go) {
      this.go = true
      this.game.pipe()
    }

    if(this.x < -this.width)
      this.drop()
  }

  drop() {
    this.game.dropPipe(this)
  }
}
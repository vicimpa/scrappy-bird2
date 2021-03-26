import { Entity } from "./Entity";
import { bird, zoom } from "~/config";
import { Display } from "~/view/Display";
import { rand } from "~/lib/Utils";
import { Sound } from "~/lib/Sounds";

const { abs } = Math
const PI5 = Math.PI / 70
const PID = Math.PI / 2
const F = Math.PI / 180

export class Bird extends Entity {
  image: HTMLImageElement
  ready = false
  
  sX = 20
  sY = 100

  width = bird.width
  height = bird.height

  frame = 0
  color = 0

  rotate = 0
  speed = 0
  maxSpeed = 20
  maxSpeed2 = 40
  minSpeed = -15

  frames = 0
  colors = 0

  upFly = 80
  upFlyNeed = this.upFly
  upFlyCount = 250
  upFlyLast = performance.now()

  init() {
    this.image = new Image()
    this.image.src = require('~/img/bird.png').default
    this.image.onload = () => {
      this.ready = true
      this.frames = this.image.width / this.width
      this.colors = this.image.height / this.height
      this.reset()
    }
  }

  reset() {
    this.x = 20
    this.y = 100
    this.rotate = 0
    this.color = rand(0, this.colors - 1)
  }

  click() {
    if(this.game.stage == 1) {
      this.upFlyLast = performance.now()

      if(this.y > -this.height) {
        this.upFly = this.upFlyNeed / 4
        this.speed = this.minSpeed
        Sound.wing.play()
      }
    }
  }

  update(delta = 0, time = 0) {
    const { upFly, height: birdHeight, game } = this
    const { stage, heightFiel: height, objects } = game

    const maxSpeed = stage == 1 ? this.maxSpeed : this.maxSpeed2

    if(this.upFly != this.upFlyNeed) {
      if(time - this.upFlyLast >= this.upFlyCount)
        this.upFly = this.upFlyNeed
    }

    if(stage < 2)
      this.frame = (abs(time % (upFly * 3 * 2) - upFly * 3) / upFly) | 0

    if (stage == 0)
      this.y = 100 + Math.cos(PID + time * 0.005) * 10


    for(let i = 0; i < objects.length; i++) {
      const obj = objects[i]
      if(!obj.isInit) continue

      if(obj.x < this.x && !obj.score) {
        obj.score = true
        game.addScore()
        Sound.point.play()
      }

      if(obj.isColize(this) && stage == 1) {
        game.stage = 2

        Sound.hit.play()

        setTimeout((e) => {
          Sound.die.play()
        }, 300)

        if (this.x > obj.x) {
          if (this.y > obj.y)
            this.speed = this.minSpeed * 0.8
          else
            this.speed = 0
        } else {
          this.speed = 0
        }
      }
    }

    if (stage == 1 || stage == 2) {
      this.rotate = (this.speed * 50 * PI5 - 10) * F

      if(this.y < height - birdHeight)
        this.speed += 0.04 * delta

      if (this.speed > maxSpeed)
        this.speed = maxSpeed

      this.y += this.speed * delta * 0.01

      if(this.y > height - birdHeight){
        this.y = height - birdHeight
        this.game.stage = 3
        Sound.hit.play()
      }
    }
  }

  render({ ctx }: Display) {
    if (!this.ready) return

    const { image, x, y, width, height } = this
    const { color, frame } = this
    const zWidth = width * zoom
    const zHeight = height * zoom

    const nX = x * zoom
    const nY = y * zoom

    const dX = zWidth*.5
    const dY = zHeight*.5

    ctx?.beginPath()
      ctx?.save()
      ctx?.translate(nX+dX, nY+dY)
      ctx?.rotate(this.rotate)

      ctx?.drawImage(image,
        width * frame, color * height, width, height,
        -dX, -dY, zWidth, zHeight)

      ctx?.rotate(-this.rotate)
      ctx?.translate(-nX-dX, -nY-dY)
      ctx?.restore()
    ctx?.closePath()
  }
}
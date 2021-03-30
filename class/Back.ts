import { Display } from "~/view/Display";
import { game, zoom } from "~/config";
import { rand } from "~/lib/Utils";
import { Entity } from "./Entity";

export class Back extends Entity {
  image: HTMLImageElement
  ready = false

  width = game.width
  height = game.height
  speed = game.width / game.speed

  color = 0
  position = 0

  colors = 0
  backColor: Uint8ClampedArray
  first = true

  init() {
    this.image = new Image()
    this.image.src = require('~/img/back.png').default
    this.image.onload = () => {
      this.ready = true
      this.colors = this.image.height / this.height
      this.reset()
    }
  }

  reset() {
    this.color = rand(0, this.colors - 1)
  }

  update(delta, time) {
    const { width, game, backColor } = this

    if(game.stage < 2)
      this.position += delta * this.speed

    if(backColor) {
      game.topColor = [...backColor]
      delete this.backColor
    }

    this.position %= width
  } 

  render({ctx}: Display) {
    if (!this.ready) return

    const { width, height } = this
    const { color, position, image } = this

    const xdiv1 = position 
    const xdiv2 = width - xdiv1

    const zWidth = width * zoom
    const zHeight = height * zoom

    ctx?.drawImage(image,
      0, height * color, width, height,
      -xdiv1*zoom, 0, zWidth, zHeight)

    ctx?.drawImage(image,
      0, height * color, width, height,
      xdiv2*zoom, 0, zWidth, zHeight)

    if(this.first) {
      this.first = false
      this.backColor = ctx.getImageData(xdiv2*zoom, 0, 1, 1).data
    }
  }
}
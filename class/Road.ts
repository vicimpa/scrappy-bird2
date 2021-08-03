import { Display } from "~/view/Display";
import { road, zoom } from "~/config";
import { Entity } from "./Entity";

export class Road extends Entity {
  image: HTMLImageElement
  ready = false
  color = 0
  position = 0

  speed = road.width / road.speed
  width = road.width
  height = road.height

  init() {
    this.image = new Image()
    this.image.src = require('~/img/road.png').default
    this.image.onload = () => {
      this.ready = true
    }
  }

  update(delta, time) {
    const { width, game } = this

    if(game.stage < 2)
      this.position += delta * this.speed

    this.position %= width
  } 

  render({ctx}: Display) {
    if (!this.ready) return

    const { width, height, game } = this
    const { color, position, image } = this

    const xdiv1 = position
    const xdiv2 = width - xdiv1

    const zWidth = width * zoom
    const zHeight = height * zoom
    const ydiv1 = game.height * zoom - zHeight

    ctx?.drawImage(image,
      0, height * color, width, height,
      -xdiv1*zoom, ydiv1, zWidth, zHeight)

    ctx?.drawImage(image,
      0, height * color, width, height,
      xdiv2*zoom-1, ydiv1, zWidth, zHeight) 
  }
}
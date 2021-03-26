import { Bird } from "./Bird";
import { Debug } from "./Debug";
import { Pipe } from "./Pipe";
import { bind, state, init } from "~/lib/Utils";
import { game, github, hiscoreKey, road, zoom } from "~/config";
import { Display } from "~/view/Display";
import { SharedState } from "@vicimpa/shared-state";
import { Back } from "./Back";
import { Road } from "./Road";
import { Sound } from "~/lib/Sounds";

const initialState = {
  score: 0,
  stage: 0,
  start: false,
  end: false
}

export class Game {
  state = new SharedState({
    ...initialState, hiscore: (() => {
      let hiscore = +localStorage.getItem(hiscoreKey)
      return isNaN(hiscore) ? 0 : hiscore
    })()
  })

  width = game.width
  height = game.height
  heightFiel = this.height - road.height

  display = new Display(this)
  double = new Display(this)

  constructor() {
    this.state.onChange(this.change)
    this.update()
  }

  @state('state')
  topColor: number[]

  @state('state')
  bottomColor: number[]

  @state('state')
  stage: number

  @state('state')
  start: number

  @state('state')
  score: number

  @init()
  back = new Back(this)

  @init()
  road = new Road(this)

  @init()
  bird = new Bird(this)

  @init()
  debug = new Debug(this)

  objects: Pipe[] = []

  work = true
  last = performance.now()

  @bind()
  click() {
    if (this.stage == 0) {
      this.stage = 1

      if (this.objects.length == 0)
        this.addPipe()
    }

    this.bird.click()
  }

  @bind()
  change() {
    const { state, setState } = this.state
    let { score, hiscore } = state

    if (score > hiscore) {
      hiscore = score
      setState({ ...state, hiscore })
      localStorage.setItem(hiscoreKey, `${hiscore}`)
    }
  }

  @bind()
  addScore() {
    this.score++
  }

  @bind()
  reset() {
    this.state.setState({
      ...this.state.state,
      ...initialState
    })

    this.objects.splice(0)
    this.bird.reset()
    Sound.swooshing.play()
  }

  @bind()
  github() {
    window.open(github)
  }

  @bind()
  addPipe() {
    this.objects.push(new Pipe(this))
  }

  @bind()
  dropPipe(p?: Pipe) {
    const { objects } = this

    if (!p) {
      const { length: l } = objects

      for (let i = 0; i < l; i++) {
        const obj = objects[i]

        if (obj instanceof Pipe)
          this.dropPipe(obj)
      }

      return
    }

    let index = objects.indexOf(p)

    if (index != -1)
      objects.splice(index, 1)
  }

  @bind()
  update(time = 0) {
    const delta = time - this.last
    this.last = time

    const { objects } = this
    const { length } = objects

    this.back.update(delta, time)
    this.road.update(delta, time)

    for (let i = 0; i < length; i++) {
      const obj = objects[i]

      if (!obj) continue

      if (!obj.isInit) {
        obj.init()
        obj.isInit = true
      }

      obj.update(delta, time)
    }

    this.bird.update(delta, time)
    this.debug.update(delta, time)

    if (delta > 100 && this.work)
      return requestAnimationFrame(this.update)

    this.render()
  }

  @bind()
  render() {
    const { display, objects } = this
    const { length } = objects

    if (display.ctx?.imageSmoothingEnabled)
      display.ctx.imageSmoothingEnabled = false

    display.ctx?.clearRect(0, 0, this.width * zoom, this.height * zoom)

    this.back.render(display)
    this.road.render(display)

    for (let i = 0; i < length; i++) {
      const obj = objects[i]
      obj?.render(display)
    }

    this.bird.render(display)
    this.debug.render(display)

    if (this.work)
      return requestAnimationFrame(this.update)
  }
}

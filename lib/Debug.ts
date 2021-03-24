import { create } from "./Dom";
import { Game } from "./Game";

export class Debug {
  #elem = create('div',
    { className: 'debug' })
  #data: { [key: string]: HTMLElement } = {}

  #run = true

  constructor(game: Game) {
    game.append(this.#elem)
  }

  get(key: string) {
    if(!this.#run) return
    return this.#data[key]?.innerText
  }

  set(key: string, value: any) {
    if(!this.#run) return

    const onCreate = this.#elem.appendChild.bind(this.#elem)
    const val = `${value}`
    const el = this.#data[key] || (this.#data[key] = create('p', { onCreate }, 
      create('b', {innerText: key+': '}), create('span', { innerText: value})))

    const need = el.querySelector('span')
    
    if(need.innerText != val)
      need.innerText = val
  }

  del(key: string) {
    if(!this.#run) return
    if(!this.#data[key])
      return

    this.#data[key].remove()
    delete this.#data[key]
  }
}
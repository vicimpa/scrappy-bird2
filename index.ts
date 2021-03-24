import "~/index.sass";
import { Game } from "~/lib/Game";

const game = new Game(document.body)
game.start()

addEventListener('mousedown', (e) => {
  e.preventDefault()
})

addEventListener('contextmenu', (e) => {
  e.preventDefault()
})
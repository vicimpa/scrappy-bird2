import "~/index.sass";
import { Game } from "~/lib/Game";

const game = new Game(document.body)
game.start()

addEventListener('mousedown', (e) => {
  e.preventDefault()

  if(game.stage != 3)
    game.click()
})

addEventListener('keydown', (e) => {
  e.preventDefault()

  if(e.key == ' ')
    game.click()

  if(e.key == 'Enter' && game.stage == 3)
    game.reset()
})

addEventListener('contextmenu', (e) => {
  e.preventDefault()
})
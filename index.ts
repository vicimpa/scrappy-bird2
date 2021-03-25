import "~/index.sass";
import { Game } from "~/lib/Game";

const game = new Game(document.body)
game.start()

function resize() {
  const { offsetWidth: width, offsetHeight: height } = game.elem
  const { offsetWidth, offsetHeight } = document.body
  const scale = Math.min(offsetWidth / width, offsetHeight / height)
  game.elem.style.transform = `scale(${scale})`
}

window.addEventListener("load", () => {
  if (navigator.serviceWorker) {
    navigator.serviceWorker
      .register("./servise.js", {
        scope: location.pathname
      })
      .then(res => {
        console.log(res.scope);
      }, console.error);
  }
});

screen.orientation.lock('portrait')
window.onload = () => resize()
window.onresize = () => resize()

addEventListener('mousedown', (e) => {
  e.preventDefault()
})

addEventListener('contextmenu', (e) => {
  e.preventDefault()
})
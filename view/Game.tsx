import React, { useState, JSX, createRef, useEffect } from "preact/compat";
import { listen } from "~/lib/Effect";
import { getZoom, isChild, isTouchDevice } from "~/lib/Utils";
import * as cfg from "~/config";
import { StartComponent } from "./Start";
import { EndComponent } from "./End";
import { Game } from "~/class/Game";

const game = new Game()

export const GameComponent = () => {
  const [scale, setScale] = useState(getZoom())
  const [{stage, score, hiscore}] = game.state.useState()
  const scoreRef = createRef<HTMLParagraphElement>()

  const showEnd = stage == 3
  const endRef = createRef<HTMLDivElement>()

  const style: JSX.CSSProperties = {
    transform: `scale(${scale})`,
    width: `${cfg.game.width * cfg.zoom}px`,
    height: `${cfg.game.height * cfg.zoom}px`
  }

  listen(window, 'DOMNodeInserted' as any, (e) => {
    console.log(e)
  })

  listen(window, 'resize', () => {
    const newScale = getZoom()

    if (scale != newScale)
      setScale(newScale)
  })

  listen(window, 'contextmenu', (e) => {
    e.preventDefault()
  })

  listen(window, 'keydown', (e) => {
    e.preventDefault()

    if(e.key == ' ' || e.key == 'Space')
      game.click()

    if(e.key == 'Enter' && stage == 3)
      game.reset()
  })

  useEffect(() => {
    setScale(getZoom())
  })

  useEffect(() => {
    const c = () => {
      scoreRef.current && 
        scoreRef.current.innerText != `${score}` &&
        (scoreRef.current.innerText = `${score}`)
    }
    const d = setInterval(c, 100); c()
    return () => clearInterval(d)
  })

  const click = (e: MouseEvent) => {
    if(!showEnd)
      e.preventDefault()

    if(isChild(e.target, endRef.current) && showEnd)
      return

    if(!isTouchDevice() && e.button == 0)
      game.click()
  }

  const touch = (e: TouchEvent) => {
    if(!showEnd)
      e.preventDefault()

    game.click()
  }

  return (
    <div style={style} onMouseDown={click} onTouchStart={touch} className="game">
      {game.double.render()}
      
      <div data-show={stage==1 || stage==2} className="debug">
        <p ref={scoreRef}>{score}</p>
      </div>
      <StartComponent show={stage == 0} />
      <EndComponent ref={endRef} show={showEnd} score={score} hiscore={hiscore}>
        <button onClick={game.reset}>Restart (Enter)</button>
        <button onClick={game.github}>Github</button>
      </EndComponent>
    </div>
  )
}
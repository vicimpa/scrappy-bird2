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
  const {topColor, bottomColor} = game

  const showEnd = stage == 3
  const endRef = createRef<HTMLDivElement>()

  const style: JSX.CSSProperties = {
    transform: `scale(${scale})`,
    width: `${cfg.game.width * cfg.zoom}px`,
    height: `${cfg.game.height * cfg.zoom}px`
  }

  const top: JSX.CSSProperties = {
    background: topColor && 
      `rgba(${topColor.join(',')})`
  }

  const bottom: JSX.CSSProperties = {
    background: bottomColor && 
      `rgba(${bottomColor.join(',')})`
  }

  listen(window, 'resize', () => {
    const newScale = getZoom()

    if (scale != newScale)
      setScale(newScale)
  })

  useEffect(() => {
    setScale(getZoom())
  })

  const click = (e: MouseEvent) => {
    if(!showEnd)
      e.preventDefault()

    if(isChild(e.target, endRef.current) && showEnd)
      return

    if(!isTouchDevice())
      game.click()
  }

  const touch = (e: TouchEvent) => {
    if(!showEnd)
      e.preventDefault()

    game.click()
  }

  return (
    <div style={style} onMouseDown={click} onTouchStart={touch} className="game">
      {/* <div style={top} className="up" />
      <div style={bottom} className="down" /> */}

      {game.double.render()}
      {game.display.render()}
      <div data-show={stage==1 || stage==2} className="debug">
        <p>{score}</p>
      </div>
      <StartComponent show={stage == 0} />
      <EndComponent ref={endRef} show={showEnd} score={score} hiscore={hiscore}>
        <button onClick={game.reset}>Restart (Enter)</button>
        <button onClick={game.github}>Github</button>
      </EndComponent>
    </div>
  )
}
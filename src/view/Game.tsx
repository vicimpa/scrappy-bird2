import { Game } from "class/Game";
import * as cfg from "config";
import { listen } from "lib/Effect";
import { getZoom, isChild, isTouchDevice } from "lib/Utils";
import { createRef, MouseEventHandler, TouchEventHandler, useEffect, useRef, useState } from "react";
import { useSnapshot } from "valtio";

import { EndComponent } from "./End";
import { StartComponent } from "./Start";
import { VolumeButton, VolumeComponent } from "./Volume";

const game = new Game();

export const GameComponent = () => {
  const [scale, setScale] = useState(getZoom());
  const [showVolume, setShowVolume] = useState(false);
  const { stage, score, hiscore } = useSnapshot(game.state);
  const scoreRef = useRef<HTMLParagraphElement>();
  const gameContainer = useRef<HTMLDivElement>();
  const showEnd = stage == 3;
  const endRef = useRef();

  const style: any = {
    transform: `scale(${scale})`,
    width: `${cfg.game.width * cfg.zoom}px`,
    height: `${cfg.game.height * cfg.zoom}px`
  };

  // listen(window, 'DOMNodeInserted' as any, (e) => {
  //   console.log(e)
  // })

  listen(window, 'resize', () => {
    const newScale = getZoom();

    if (scale != newScale)
      setScale(newScale);
  });

  listen(window, 'contextmenu', (e) => {
    e.preventDefault();
  });

  listen(window, 'keydown', (e) => {
    e.preventDefault();

    if (e.key == ' ' || e.key == 'Space')
      game.click();

    if (e.key == 'Enter' && stage == 3)
      game.reset();
  });

  useEffect(() => {
    setScale(getZoom());
  });

  useEffect(() => {
    const c = () => {
      scoreRef.current &&
        scoreRef.current.innerText != `${score}` &&
        (scoreRef.current.innerText = `${score}`);
    };
    const d = setInterval(c, 100); c();
    return () => clearInterval(d);
  });

  useEffect(() => {
    const click = (e: MouseEvent) => {
      const showEnd = game.state.stage == 3;

      if (!showEnd)
        e.preventDefault();

      if (isChild(e.target as any, endRef.current as any) && showEnd)
        return;

      if (!isTouchDevice() && e.button == 0)
        game.click();
    };

    const touch = (e: TouchEvent) => {
      const showEnd = game.state.stage == 3;

      if (!showEnd)
        e.preventDefault();

      game.click();
    };

    gameContainer.current?.addEventListener('mousedown', click);
    gameContainer.current?.addEventListener('touchstart', touch);

    return () => {
      gameContainer.current?.removeEventListener('mousedown', click);
      gameContainer.current?.removeEventListener('touchstart', touch);
    };
  }, []);

  return (
    <div style={style as any} ref={gameContainer} className="game">
      <VolumeButton onClick={() => setShowVolume(!showVolume)} />

      {game.display.render()}

      <div data-show={stage == 1 || stage == 2} className="debug">
        <p ref={scoreRef}>{score}</p>
      </div>
      <StartComponent show={stage == 0} />
      <EndComponent ref={endRef as any} show={showEnd} score={score} hiscore={hiscore}>
        <button onClick={game.reset}>Restart (Enter)</button>
        <button onClick={game.github}>Github</button>
      </EndComponent>
      <VolumeComponent
        onOutsideClick={() => setShowVolume(false)}
        show={showVolume} />
    </div>
  );
};
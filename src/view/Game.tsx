import { Game } from "class/Game";
import * as cfg from "config";
import { useEvent } from "hooks/useEvent";
import { ScaleProvider } from "lib/Scale";
import { getZoom, isChild, isTouchDevice } from "lib/Utils";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSnapshot } from "valtio";

import { EndComponent } from "./End";
import { StartComponent } from "./Start";
import { VolumeButton, VolumeComponent } from "./Volume";


export const GameComponent = () => {
  const [game] = useState(() => new Game());
  const [scale, setScale] = useState(getZoom());
  const [showVolume, setShowVolume] = useState(false);
  const { stage, score, hiscore } = useSnapshot(game.state);
  const scoreRef = useRef<HTMLParagraphElement>();
  const gameContainer = useRef<HTMLDivElement>();
  const showEnd = stage == 3;
  const endRef = useRef<HTMLDivElement>();
  const volumeRef = useRef<HTMLDivElement>();

  useEffect(() => {
    return game.destroy;
  }, [game]);

  const style: any = {
    // transform: `scale(${scale})`,
    width: `${cfg.game.width * cfg.zoom * scale}px`,
    height: `${cfg.game.height * cfg.zoom * scale}px`
  };

  useEvent(window, 'resize', () => {
    const newScale = getZoom();

    if (scale != newScale) {
      setScale(newScale);
    }
  });

  useEffect(() => {
    game.setScale(scale);
  }, [scale]);

  useEvent(window, 'contextmenu', (e) => {
    e.preventDefault();
  });

  useEvent(window, 'keydown', (e) => {
    e.preventDefault();

    if (game.state.stage == 3) game.reset();
    else game.click();
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

  useEvent(gameContainer, 'mousedown', e => {
    if (isChild(e.target as any, endRef.current as any) || isChild(e.target as any, volumeRef.current as any))
      return;

    e.preventDefault();

    if (!isTouchDevice() && e.button == 0)
      game.click();
  });

  useEvent(gameContainer, 'touchstart', e => {
    if (isChild(e.target as any, endRef.current as any) || isChild(e.target as any, volumeRef.current as any))
      return;

    e.preventDefault();
    game.click();
  });

  return (
    <ScaleProvider value={scale}>
      <VolumeButton onClick={() => setShowVolume(!showVolume)} />

      <div style={style as any} ref={gameContainer} className="game">
        {game.display.render(scale)}

        <div style={{ transform: `scale(${scale})` }} data-show={stage == 1 || stage == 2} className="debug">
          <p ref={scoreRef}>{score}</p>
        </div>
        <StartComponent show={stage == 0} />
        <EndComponent ref={endRef as any} show={showEnd} score={score} hiscore={hiscore}>
          <button onClick={game.reset}>Restart (Enter)</button>
          <button onClick={game.github}>Github</button>
        </EndComponent>
        <VolumeComponent
          ref={volumeRef}
          onOutsideClick={() => setShowVolume(false)}
          show={showVolume} />
      </div>
    </ScaleProvider>
  );
};
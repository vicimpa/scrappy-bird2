import { Game } from "class/Game";
import * as cfg from "config";
import { useEvent, useWindowEvent } from "hooks/useEvent";
import { ScaleProvider } from "lib/Scale";
import { getZoom, isChild, isTouchDevice } from "lib/Utils";
import { MouseEventHandler, TouchEventHandler, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSnapshot } from "valtio";

import { EndComponent } from "./End";
import { VolumeButton, VolumeComponent } from "./Volume";


export const GameComponent = () => {
  const game = useMemo(() => new Game(), [Game]);
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
    width: `${cfg.game.width * scale}px`,
    height: `${cfg.game.height * scale}px`
  };

  useEvent(window, 'resize', () => {
    const newScale = getZoom();

    if (scale != newScale) {
      setScale(newScale);
    }
  });

  useEffect(() => {
    game.setScale(scale);
  }, [scale, game]);

  useWindowEvent('contextmenu', (e) => {
    e.preventDefault();
  });

  useWindowEvent('keydown', (e) => {
    e.preventDefault();

    if (game.state.stage == 3) game.reset();
    else game.click();
  }, [game]);

  const onMouseDown = useCallback<MouseEventHandler>(e => {
    if (
      isChild(e.target as any, endRef.current as any) ||
      isChild(e.target as any, volumeRef.current as any)
    ) return;

    e.preventDefault();

    if (!isTouchDevice() && e.button == 0) {
      game.click();
    }
  }, [game]);

  const onTouchStart = useCallback<TouchEventHandler>(e => {
    if (isChild(e.target as any, endRef.current as any) || isChild(e.target as any, volumeRef.current as any))
      return;

    e.preventDefault();
    game.click();
  }, [game]);

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

  return (
    <ScaleProvider value={scale}>
      <VolumeButton onClick={() => setShowVolume(!showVolume)} />

      <div onMouseDown={onMouseDown} onTouchStart={onTouchStart} style={style as any} ref={gameContainer} className="game">
        {game.display.render(scale)}

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
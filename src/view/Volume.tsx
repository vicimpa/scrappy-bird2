import { zoom } from "config";
import { isOutside } from "lib/Outside";
import { Sound, state } from "lib/Sounds";
import { FC, MouseEventHandler, useEffect, useRef, useState } from "react";
import { useSnapshot } from "valtio";

interface IVolumeButton {
  onClick?: MouseEventHandler;
}

export const VolumeButton: FC<IVolumeButton> = ({
  onClick = () => null
}) => {
  const { volume } = useSnapshot(state);

  let className = 'mute2';

  if (volume > .00) className = 'mute';
  if (volume > .25) className = 'low';
  if (volume > 0.5) className = 'medium';
  if (volume > .75) className = 'high';


  const click: MouseEventHandler = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onClick(e);
  };

  return (
    <i
      style={{ ['--zoom']: zoom } as any}
      onMouseDown={click}
      className={`volume-btn icon-volume-${className}`} />
  );
};

interface IVolumeProps {
  show?: boolean;
  onOutsideClick?: MouseEventHandler;
}

export const VolumeComponent: FC<IVolumeProps> = (props) => {
  const {
    show = false,
    onOutsideClick = () => null
  } = props;
  const { volume } = useSnapshot(state);
  const ref = useRef<HTMLDivElement>();

  const change = (n = 0) => {
    return () => {
      let newState = state.volume + n;
      if (newState < 0) newState = 0;
      if (newState > 1) newState = 1;
      state.volume = newState;
    };
  };

  const down: MouseEventHandler = (e) => {
    if (isOutside(e.target as any, ref.current as any))
      return onOutsideClick(e);

    if (show)
      e.stopPropagation();
  };

  return (
    <div onMouseDown={down} style={{ '--zoom': zoom } as any} data-show={show} className="volume">
      <div ref={ref as any} className="block">
        <p className="score">
          Volume:
          <span>  {volume * 100 | 0}%</span>
        </p>

        <div className="space"></div>
        <p className="btns">
          <i
            onClick={change(-.1)}
            className='icon-volume-decrease' />

          <i
            onClick={change(.1)} className='icon-volume-increase' />
        </p>
        <div className="space"></div>
        <button onClick={() => Sound.test()}>Test</button>
        <button onClick={onOutsideClick}>Ok</button>
      </div>
    </div>
  );
};
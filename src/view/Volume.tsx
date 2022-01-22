import { zoom } from "config";
import { isOutside } from "lib/Outside";
import { Sound, state } from "lib/Sounds";
import { FC, MouseEventHandler, useEffect, useRef, useState } from "react";

interface IVolumeButton {
  onClick?: MouseEventHandler;
}

export const VolumeButton: FC<IVolumeButton> = ({
  onClick = () => null
}) => {
  const volume = state.use();

  let className = 'mute2';

  if (volume == 0) className = 'mute';
  if (volume > 0) className = 'low';
  if (volume > 4) className = 'medium';
  if (volume > 7) className = 'high';


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
  const volume = state.use();
  const ref = useRef<HTMLDivElement>();

  const change = (n = 0) => {
    return () => {
      state.volume = state.volume + n;
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
          <span>  {volume * 10 | 0}%</span>
        </p>

        <div className="space"></div>
        <p className="btns">
          <i
            onClick={change(-1)}
            className='icon-volume-decrease' />

          <i
            onClick={change(1)} className='icon-volume-increase' />
        </p>
        <div className="space"></div>
        <button onClick={() => Sound.test()}>Test</button>
        <button onClick={onOutsideClick}>Ok</button>
      </div>
    </div>
  );
};
import { zoom } from "config";
import { isOutside } from "lib/Outside";
import { useScale } from "lib/Scale";
import { Sound, state } from "lib/Sounds";
import { FC, forwardRef, MouseEventHandler, useEffect, useRef, useState } from "react";

interface IVolumeButton {
  onClick?: MouseEventHandler;
}

export const VolumeButton: FC<IVolumeButton> = ({
  onClick = () => null
}) => {
  const scale = useScale();
  const volume = state.use();

  let className = 'mute2';

  if (volume > 0) className = 'mute';
  if (volume > 2) className = 'low';
  if (volume > 4) className = 'medium';
  if (volume > 6) className = 'high';

  const click: MouseEventHandler = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onClick(e);
  };

  return (
    <i
      style={{
        ['--zoom']: zoom,
        transform: `matrix(${scale}, 0, 0, ${scale}, ${-14 * scale}, ${14 * scale})`
      } as any}
      onMouseDown={click}
      className={`volume-btn icon-volume-${className}`} />
  );
};

interface IVolumeProps {
  show?: boolean;
  onOutsideClick?: MouseEventHandler;
}

export const VolumeComponent = forwardRef<HTMLDivElement, IVolumeProps>((props, ref) => {
  const scale = useScale();
  const {
    show = false,
    onOutsideClick = () => null
  } = props;
  const volume = state.use();

  const change = (n = 0) => {
    return () => {
      state.volume = state.volume + n;
    };
  };

  // TODO Передела сцуко!
  const down = ((e: Event) => {
    if (isOutside(e.target as any, (ref as any)?.current as any))
      return onOutsideClick(e as any);

    if (show)
      e.stopPropagation();
  }) as any;

  return (
    <div
      onMouseDown={down}
      onTouchStart={down}
      style={{ '--zoom': zoom, transform: `scale${scale}` } as any}
      data-show={show}
      className="volume"
    >
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
});
import { zoom } from "config";
import { useScale } from "lib/Scale";
import { forwardRef, PropsWithChildren, RefObject, useEffect, useRef } from "react";

type IEndProps = PropsWithChildren<{
  show?: boolean;
  ref?: RefObject<HTMLDivElement>;
  score?: number;
  hiscore?: number;
}>;

export const EndComponent = forwardRef<HTMLElement, IEndProps>((props, ref) => {
  const scale = useScale();
  const {
    show = false,
    score = 0,
    hiscore = 0
  } = props;

  const scoreRef = useRef<HTMLSpanElement>();
  const hiscoreRef = useRef<HTMLSpanElement>();

  useEffect(() => {
    const c = () => {
      scoreRef.current &&
        scoreRef.current.innerText != `${score}` &&
        (scoreRef.current.innerText = `${score}`);

      hiscoreRef.current &&
        hiscoreRef.current.innerText != `${hiscore}` &&
        (hiscoreRef.current.innerText = `${hiscore}`);
    };
    const d = setInterval(c, 100); c();
    return () => clearInterval(d);
  });

  return (
    <div
      style={{ '--zoom': zoom, transform: `scale(${scale})` } as any}
      data-show={show}
      className="end"
    >
      <div ref={ref as any} className="block">
        <p className="score">Score <span ref={scoreRef as any}>{score}</span></p>
        <p className="hiscore">Best <span ref={hiscoreRef as any}>{hiscore}</span></p>
        <div className="space"></div>
        {props.children}
      </div>
    </div>
  );
});
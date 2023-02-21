import { useScale } from "lib/Scale";
import { forwardRef, PropsWithChildren, RefObject, useEffect, useRef } from "react";

type IEndProps = PropsWithChildren<{
  show?: boolean;
  ref?: RefObject<HTMLDivElement>;
  score?: number;
  hiscore?: number;
}>;

export const EndComponent = forwardRef<HTMLDivElement, IEndProps>((props, ref) => {
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

  useEffect(() => {
    const r = ref as RefObject<HTMLDivElement>;

    const end = () => {
      console.log("End");
      r.current?.querySelectorAll('button').forEach(el => el.disabled = false);
    };

    r.current?.addEventListener('transitionend', end);

    return () => {
      r.current?.removeEventListener('transitionend', end);
    };
  }, []);

  useEffect(() => {
    if (!show) return;
    const r = ref as RefObject<HTMLDivElement>;
    console.log("Start");
    r.current?.querySelectorAll('button').forEach(el => el.disabled = true);
  }, [show]);

  return (
    <div
      style={{ ['--zoom']: 2, transform: `scale(${scale * .4})` } as any}
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
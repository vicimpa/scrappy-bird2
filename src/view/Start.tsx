import { zoom } from "config";
import startImg from "img/start.png";
import { useScale } from "lib/Scale";

export const StartComponent = ({ show = false }) => {
  const scale = useScale();
  return (
    <div
      style={{ '--zoom': zoom, transform: `scale(${scale})` } as any}
      data-show={show}
      className="start"
    >
      <img src={startImg} />
    </div>
  );
};
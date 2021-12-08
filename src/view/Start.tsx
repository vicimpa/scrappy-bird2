import { zoom } from "../config";

import startImg from "img/start.png";

export const StartComponent = ({ show = false }) => {

  return (
    <div style={{ '--zoom': zoom } as any} data-show={show} className="start">
      <img src={startImg} />
    </div>
  );
};
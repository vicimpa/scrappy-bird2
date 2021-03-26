import React from "preact/compat";
import { zoom } from "~/config";

export const StartComponent = ({show = false}) => {

  return ( 
    <div style={{transform: `scale(${zoom})`}} data-show={show} className="start">
      <img src={require(`~/img/start.png`).default} />
    </div>
  )
}
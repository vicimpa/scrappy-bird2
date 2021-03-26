import { RefObject } from "preact";
import React, { FC, createRef } from "preact/compat";
import { zoom } from "../config";

interface IEndProps {
  show?: boolean
  ref?: RefObject<HTMLDivElement>
  score?: number
  hiscore?: number
}

export const EndComponent: FC<IEndProps> = (props) => {
  const {
    show = false,
    score = 0,
    hiscore = 0
  } = props

  return (
    <div style={{transform: `scale(${zoom})`}} data-show={show} className="end">
      <div ref={props.ref} className="block">
        <p className="score">Score <span>{score}</span></p>
        <p className="hiscore">Best <span>{hiscore}</span></p>
        <div className="space"></div>
        {props.children}
      </div>
    </div>
  )
}
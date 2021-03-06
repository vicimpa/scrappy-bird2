import { RefObject } from "preact";
import React, { FC, useEffect, createRef } from "preact/compat";
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

  const scoreRef = createRef<HTMLSpanElement>()
  const hiscoreRef = createRef<HTMLSpanElement>()

  useEffect(() => {
    const c = () => {
      scoreRef.current && 
        scoreRef.current.innerText != `${score}` &&
        (scoreRef.current.innerText = `${score}`)

      hiscoreRef.current && 
        hiscoreRef.current.innerText != `${hiscore}` &&
        (hiscoreRef.current.innerText = `${hiscore}`)
    }
    const d = setInterval(c, 100); c()
    return () => clearInterval(d)
  })

  return (
    <div style={{'--zoom': zoom}} data-show={show} className="end">
      <div ref={props.ref} className="block">
        <p className="score">Score <span ref={scoreRef}>{score}</span></p>
        <p className="hiscore">Best <span ref={hiscoreRef}>{hiscore}</span></p>
        <div className="space"></div>
        {props.children}
      </div>
    </div>
  )
}
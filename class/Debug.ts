import { SharedState } from "@vicimpa/shared-state";
import { Entity } from "./Entity";

export class Debug extends Entity {
  data = new SharedState<{ [key: string]: string }>({})

  get(key: string) {
    return this.data.state[key]
  }

  set(key: string, value: any) {
    const { state } = this.data
    if(this.get(key) != value)
      this.data.setState({ ...state, [key]: `${value}` })
  }

  del(key: string) {
    const { state } = this.data
    const { [key]: v, ...newState } = state
    
    if(this.get(key))
      this.data.setState(newState)
  }
}
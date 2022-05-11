import { effect, ReactiveEffect } from "./effect"

class ComImpl {
  dirtry = false
  _value
  effect
  constructor(public getter) {
  this.effect = new ReactiveEffect(getter, ()=> {
      if(this.dirtry) {
        this.dirtry = false
      }
    })
  }
  get value () {
    
    if (!this.dirtry) {
      this.dirtry = true
     this._value = this.effect.runner()
    }
    return this._value
  }
}

export const computed = (getter)=> {
  return new ComImpl(getter)
}
import { hasChange, isObject } from "../shared"
import { isTracking, track, trackEffect, triggerEffect } from "./effect"
import { reactive } from "./reactive"

class RefImpl {
  dep= new Set()
  rawVal
  public __v_isRef = true;

  constructor(public _value) {
    this.rawVal = _value
    this._value = isObject(_value) ? reactive(_value) : _value
    
  }
  get value () {
    if (isTracking()) {
      trackEffect(this.dep)
    }
    
    return this._value
  }
  set value(val) {
    console.log(val, this.rawVal);
    
    if (hasChange(val, this.rawVal)) {
      this.rawVal = val;

      this._value = isObject(val) ? reactive(val) : val
      triggerEffect(this.dep)
    }
   
  }

}

export const ref = (raw) => {
  return new RefImpl(raw)
}
export const isRef = (raw) => {
  return !!raw['__v_isRef']
}

export const unRef = (raw) => {
  return isRef(raw) ? raw.value : raw
}

export const proxyRefs = (raw) => {
  return new Proxy(raw, {
    get(target, key) {
      return unRef(Reflect.get(target, key))
    },
    set(target, key,value) {
      if (isRef(target[key]) && !isRef(value)) {
        return (target[key].value = value);
      } else {
        return Reflect.set(target, key, value);
      }
    }
  })
}

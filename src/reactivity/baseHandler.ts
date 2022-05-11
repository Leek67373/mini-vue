import { extend, isObject } from "../shared";
import { track, trigger } from "./effect";
import { reactive, ReactiveFlags, readonly } from "./reactive";

const creatGetter = (isReadonly = false, shallow = false)=> {
  return (target, key ) => {
    if (key === ReactiveFlags.IS_REACTIVE) {
      return !isReadonly;
    } else if (key === ReactiveFlags.IS_READONLY) {
      return isReadonly;
    }
    const res = Reflect.get(target, key)
    if (shallow) {
      return res
    }

    if (isObject(res)) {
      return isReadonly ? readonly(res) : reactive(res);
    }
    if (!isReadonly) {
      track(target, key)
    }
    return res
  }
}

const creatSetter = () => {
  return (target, key, value) => {
    const res = Reflect.set(target, key, value)
    trigger(target, key)
    return res
  }
}

let get = creatGetter()
let set = creatSetter()

export const mutableHandlers = {
  get,
  set,
};

export const readonlyeHandlers = {
  get: creatGetter(true),
  set: (target, key, value) => {
    console.warn('readonly: not set')
     return true
   }
}

export const shallowReadonlyHandlers = extend({}, readonlyeHandlers, {
  get: creatGetter(true, true)
})
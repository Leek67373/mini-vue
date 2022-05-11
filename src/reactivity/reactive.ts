import { mutableHandlers, readonlyeHandlers, shallowReadonlyHandlers } from "./baseHandler"
import { track, trigger } from "./effect"

export const enum ReactiveFlags {
  IS_REACTIVE = "__v_isReactive",
  IS_READONLY = "__v_isReadonly",
}

export const reactive = (raw) => {
  return createReactiveObject(raw, mutableHandlers)
}

export const readonly = (raw) => {
  return createReactiveObject(raw, readonlyeHandlers)
}
export const shallowReadonly = (raw) => {
  return createReactiveObject(raw, shallowReadonlyHandlers)
}

export const isReadonly= (raw) => {
  return !!raw[ReactiveFlags.IS_READONLY]
}
export const isReactive= (raw) => {
  return !!raw[ReactiveFlags.IS_REACTIVE]
}

export const isProxy= (raw) => {
  return isReadonly(raw) || isReactive(raw)
}


function createReactiveObject(target, baseHandles) {

  return new Proxy(target, baseHandles);
}
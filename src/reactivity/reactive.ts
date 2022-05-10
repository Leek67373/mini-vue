import { track, trigger } from "./effect"

export const reactive = (obj) => {
  return new Proxy(obj,{
    get(target, key ) {
      console.log('222')
      const res = Reflect.get(target, key)
      track(target, key)
      return res
    },
    set(target, key, value) {
      const res = Reflect.set(target, key, value)
      trigger(target, key)
      return res
    }
  })
}
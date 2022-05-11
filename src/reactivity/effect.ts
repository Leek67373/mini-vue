import { extend } from "../shared"

let  curEffect
let targetMap = new Map()
let shouldTrack = false

export class ReactiveEffect {
  public deps: any = []
  constructor (private fn, public scheduler?) {}
  actived=true
  onStop?: ()=> void
  runner() {
    if (!this.actived) {
      return this.fn()
    }
    curEffect = this
    shouldTrack = true;
    const r = this.fn();

    // 重置
    shouldTrack = false;
    return r
    
  }

  stop() {
    if (this.actived) {
      cleanEffect(this)
      if (this.onStop) {
        this.onStop()
      }
      this.actived = false
    }

  }
}
function cleanEffect (effect) {
  effect.deps.forEach(item => {
    item.delete(effect)
  })
}
export const effect = (fn, options:any={}) => {
  const {scheduler} = options
  const effect = new ReactiveEffect(fn, scheduler)
  extend(effect, options)
  effect.runner()
  const runner:any = effect.runner.bind(effect)
  runner.effect = effect
  return runner
}

export function isTracking() {
  return shouldTrack && curEffect !== undefined;
}


export const track = (target, key) => {
  if (!isTracking()) return
  let depsMap = targetMap.get(target)
  if (!depsMap) {
    depsMap = new Map()
    targetMap.set(target,depsMap)
  }
  let dep = depsMap.get(key)
  if(!dep) {
    dep = new Set()
    depsMap.set(key, dep)
  }
  trackEffect(dep)
}

export const trackEffect = (dep) => {
  dep.add(curEffect)
  curEffect.deps.push(dep)
}
export const trigger = (target, key) => {
  let depsMap = targetMap.get(target)
  let dep = depsMap.get(key)
  triggerEffect(dep)

}

export const triggerEffect = (dep)=> {
  
  dep.forEach(item => {
    if (item.scheduler) {
      item.scheduler()
    } else {
      item.runner()
    }
  });
}

export const stop = (runner:any)=> {
  runner.effect.stop()
}
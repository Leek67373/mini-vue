export function creatComponentInstance(vnode: any) {
  const instance = {
    vnode,
    type: vnode.type,
    setupStatus: {}
  }

  return instance
}

export function setuComponent(instance) {
  // init props
  // init slots

  setupStatusfulComponent(instance)
}

export function setupStatusfulComponent(instance) {
  const component = instance.type

  // ctx is
  instance.proxy = new Proxy({}, {
    get(target,key) {
      const {setupStatus} = instance
      if (key in setupStatus) {
        return setupStatus[key]
      }

      if (key === '$el') {
        return instance.vnode.el
      }
    }
  })
  const {setup} = component
  if (setup) {
    const setupRes = setup()
    handleSetupRes(instance, setupRes)
  }
}

function handleSetupRes(instance, setupRes: any) {
  if (typeof setupRes === 'object') {
    instance.setupStatus = setupRes
  }

  finishComponentsSetup(instance) 
}

function finishComponentsSetup(instance: any) {
  const component = instance.type
  instance.render = component.render
  // if (component.render) {
  //   instance.render = component.render
  // }
}

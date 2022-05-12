import { createVNode } from "./createVNode"
import { render } from "./render"

export const createApp = (rootComponent) => {
    

  return {
    mount(rootContainer) {
      const vnode = createVNode(rootComponent)
      render(vnode, rootContainer)
    }
  }
}










import { isObject } from "../shared"
import { creatComponentInstance, setuComponent } from "./component"

export function render(vnode, container) {
  // pach
  patch(vnode, container)
}

// 判断当前vnode是个组件，还是一个ele
function patch(vnode: any, container: any) {

  if (typeof vnode.type === 'string') {
    processElement(vnode, container)
  } else if (isObject(vnode.type)) {
    // 处理组件的逻辑
    processComponent(vnode, container)
  }
 
  
}

function processComponent(vnode: any, container: any) {
  mountComponent(vnode, container)
}

function mountComponent(vnode: any, container) {
  const instance = creatComponentInstance(vnode)
  setuComponent(instance)
  setupRenderEffect(instance, container)
}

function setupRenderEffect(instance, container: any) {
  const subTree = instance.render.call(instance.proxy)
  patch(subTree, container)
}




function processElement(vnode: any, container: any) {
  mountElement(vnode, container)
}
function mountElement(vnode: any, container: any) {
  const el = (vnode.el = document.createElement(vnode.type))
  const {children, props} = vnode

  if (typeof children === 'string') {
    el.textContent = children
  } else if (Array.isArray(children)) {
    mountchildren(children, el)
  }

  
  for (let key in props) {
    el.setAttribute(key, props[key])
  }
  container.appendChild(el)
}

function mountchildren (v, container: any) {
  v.forEach((v)=> {
    patch(v, container)
  })
}

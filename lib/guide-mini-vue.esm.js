const createVNode = (type, props, children) => {
    const vnode = {
        type,
        props,
        children,
        el: null
    };
    return vnode;
};

function h(type, props, children) {
    return createVNode(type, props, children);
}

const isObject = (obj) => obj !== null && typeof obj === 'object';

function creatComponentInstance(vnode) {
    const component = {
        vnode,
        type: vnode.type,
        setupStatus: {}
    };
    return component;
}
function setuComponent(instance) {
    // init props
    // init slots
    setupStatusfulComponent(instance);
}
function setupStatusfulComponent(instance) {
    const component = instance.type;
    // ctx is
    instance.proxy = new Proxy({}, {
        get(target, key) {
            const { setupStatus } = instance;
            if (key in setupStatus) {
                return setupStatus[key];
            }
            if (key === '$el') {
                return instance.vnode.el;
            }
        }
    });
    const { setup } = component;
    if (setup) {
        const setupRes = setup();
        handleSetupRes(instance, setupRes);
    }
}
function handleSetupRes(instance, setupRes) {
    if (typeof setupRes === 'object') {
        instance.setupStatus = setupRes;
    }
    finishComponentsSetup(instance);
}
function finishComponentsSetup(instance) {
    const component = instance.type;
    instance.render = component.render;
    // if (component.render) {
    //   instance.render = component.render
    // }
}

function render(vnode, container) {
    // pach
    patch(vnode, container);
}
// 判断当前vnode是个组件，还是一个ele
function patch(vnode, container) {
    if (typeof vnode.type === 'string') {
        processElement(vnode, container);
    }
    else if (isObject(vnode.type)) {
        // 处理组件的逻辑
        processComponent(vnode, container);
    }
}
function processComponent(vnode, container) {
    mountComponent(vnode, container);
}
function mountComponent(vnode, container) {
    const instance = creatComponentInstance(vnode);
    setuComponent(instance);
    setupRenderEffect(instance, container);
}
function setupRenderEffect(instance, container) {
    const subTree = instance.render.call(instance.proxy);
    patch(subTree, container);
}
function processElement(vnode, container) {
    mountElement(vnode, container);
}
function mountElement(vnode, container) {
    const el = (vnode.el = document.createElement(vnode.type));
    const { children, props } = vnode;
    if (typeof children === 'string') {
        el.textContent = children;
    }
    else if (Array.isArray(children)) {
        mountchildren(children, el);
    }
    for (let key in props) {
        el.setAttribute(key, props[key]);
    }
    container.appendChild(el);
}
function mountchildren(v, container) {
    v.forEach((v) => {
        patch(v, container);
    });
}

const createApp = (rootComponent) => {
    return {
        mount(rootContainer) {
            const vnode = createVNode(rootComponent);
            render(vnode, rootContainer);
        }
    };
};

export { createApp, h };

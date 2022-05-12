'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const createVNode = (type, props, children) => {
    const vnode = {
        type,
        props,
        children
    };
    return vnode;
};

function h(type, props, children) {
    return createVNode(type, props, children);
}

function creatComponentInstance(vnode) {
    const component = {
        vnode,
        type: vnode.type
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
    patch(vnode);
}
// 判断当前vnode是个组件，还是一个ele
function patch(vnode, container) {
    console.log(vnode.type, '111');
    // 处理组件的逻辑
    processComponent(vnode);
}
function processComponent(vnode, container) {
    mountComponent(vnode);
}
function mountComponent(vnode, container) {
    const instance = creatComponentInstance(vnode);
    setuComponent(instance);
    setupRenderEffect(instance);
}
function setupRenderEffect(instance, container) {
    const subTree = instance.render();
    patch(subTree);
}

const createApp = (rootComponent) => {
    return {
        mount(rootContainer) {
            const vnode = createVNode(rootComponent);
            render(vnode);
        }
    };
};

exports.createApp = createApp;
exports.h = h;

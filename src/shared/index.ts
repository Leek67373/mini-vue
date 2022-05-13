export const extend =  Object.assign
export const isObject = (obj) => obj !== null && typeof obj === 'object'
export const hasChange = (val, newVal) => !Object.is(val, newVal)
export const hasOwn = (val, key) => Object.prototype.hasOwnProperty.call(val, key);
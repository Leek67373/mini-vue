import {describe, it, expect } from 'vitest'
import { reactive } from '../reactive'


describe('reactive', ()=> {
  it('happy path', ()=> {
    const obj = {
      foo: '1'
    }
    const user = reactive(obj)
    expect(user).not.toBe(obj)
    expect(user.foo).toBe('1')

  })
 
})
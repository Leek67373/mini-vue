import {describe, it, expect , vi} from 'vitest'
import { effect, stop} from '../effect'
import { reactive } from '../reactive'


describe('effect', ()=> {
  it('happy path', ()=> {
    const user = reactive({
      age: 18
    })
    let age 
    effect(()=> {
      age = user.age
    })
    user.age ++ 
    expect(age).toBe(19)
  })

  it('return runner', ()=> {
    let age = 18
    // effect 函数会返回一个函数，执行这个函数fn就会再走一次
    const runner = effect(()=> {
      age ++
      return 'foo'
    })
    expect(age).toBe(19)
    const r = runner()
    expect(age).toBe(20)

    expect(r).toBe('foo')
  })

  it("scheduler", () => {
    let dummy;
    let run: any;
    const scheduler = vi.fn(() => {
      run = runner;
    });
    const obj = reactive({ foo: 1 });
    const runner = effect(
      () => {
        dummy = obj.foo;
      },
      { scheduler }
    );
    expect(scheduler).not.toHaveBeenCalled();
    expect(dummy).toBe(1);
    // should be called on first trigger
    obj.foo++;
    expect(scheduler).toHaveBeenCalledTimes(1);
    // // should not run yet
    expect(dummy).toBe(1);
    // // manually run
    run();
    // // should have run
    expect(dummy).toBe(2);
  });

  it("stop", () => {
    let dummy;
    const obj = reactive({ prop: 1 });
    const runner = effect(() => {
      dummy = obj.prop;
    });
    obj.prop = 2;
    expect(dummy).toBe(2);
    stop(runner);
    // obj.prop = 3;
    obj.prop++;
    expect(dummy).toBe(2);

    // stopped effect should still be manually callable
    runner();
    expect(dummy).toBe(3);
  });

  it("onStop", () => {
    const obj = reactive({
      foo: 1,
    });
    const onStop = vi.fn();
    let dummy;
    const runner = effect(
      () => {
        dummy = obj.foo;
      },
      {
        onStop,
      }
    );

    stop(runner);
    expect(onStop).toBeCalledTimes(1);
  });
 
})
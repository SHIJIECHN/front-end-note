---
autoGroup-2: Hook
sidebarDepth: 3
title: useReducer
---

## useReducer
与redux较为相似。

> 为什么会存在redux？

- 类组件中的state是一个对象，所有的数据类型豆要在一个state中完成
- 根据组件数据单向流原则，想操作state必须通过对应的方法，如果是父组件中的数据必须在父组件定义对应的方法，子组件定义自己的方法，存在数据混乱的问题

> redux存在的作用？

统一管理所有的数据，实现所有数据状态调度的问题，用一种方式实现所有数据的更新。

> 如何用一种方法统一更改或调度state？

在视图中使用dispatch(action)方法实现所有数据的调度

> action行为是什么？

有一个对象描述当前的行为{type: 'decrement'}

> reducer函数有什么用？

```javascript
/**
 * 希望通过reducer函数进行统一调度(归纳/管理)
 * @param {*} state 初始状态
 * @param {*} action 动作对象
 */
function reducer(state, action) {
  //判断动作行为的类型
  switch (action.type) {
    case 'decrement':
      return { count: state.count - 1 };
    case 'increment':
      return { count: state.count + 1 };
    default:
      throw new Error();
  }
}
```

使用方式：
1. 视图组件发起更改state状态的行为。dispatch(action)。
2. 定义reducer函数，根据action行为的类型编写相应的业务逻辑。
3. 执行useReducer函数，传入reducer函数和state初始值作为第一、第二个参数
4. useReducer函数返回修改后的state状态数据

```javascript
//重写useReducer钩子函数
/**
 * 重写useReducer钩子函数
 * @param {*} reducer 统一调度归纳函数
 * @param {*} initialState 初始值state
 */
function useReducer(reducer, initialCount) {
  const [count, setCount] = useState(initialCount);

  /**
   * dispatch函数执行reducer函数并修改count数据
   * @param {*} action 接收action对象
   */
  const dispatch = (action) => {
    const newCount = reducer(count, action);
    setCount(newCount);
  };

  //返回最新的count
  return [count, dispatch];
}
```


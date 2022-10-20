---
autoGroup-1: React
sidebarDepth: 3
title: 高阶组件
---

## 高阶组件
高阶组件(High Order Component, HOC)的特点：
1. HOC 不是React提供的API，高级的设计模式
2. HOC是一个函数，接收一个组件参数， 返回一个新组件
3. 普通组件返回的是UI，HOC返回的是一个新组件
4. HOC不能修改参数组件，只能传入组件所需要的props
5. HOC是一个没有副作用的纯函数
6. HOC除了必须传入被包裹的组件参数以外。其余参数根据需求增加
7. HOC不关心数据如何使用，包裹组件不关心数据从哪里来
8. HOC和包裹组件直接唯一的契合点就是props

## 使用HOC解决横切关注点问题
以前使用mixins解决横切关注点的问题。现在可以使用HOC
1. 对参数组件本身的逻辑与试图的横向切割
2. 让HOC来完成逻辑和状态的管理，让参数组件来完成视图的渲染。让HOC将数据与逻辑传递到参数组件中，从而完成关注点分离且有机结合的任务。

```javascript
// ListHoc.jsx
// 接受一个组件作为参数
function listHoc(WrapperComponent, fetchListData) {
  // 返回另一个组件
  return class extends React.Component {
    // 状态管理
    state = {
      listData: []
    }

    // 参数组件需要的事件处理函数
    removeStudent(id) {/** */}
    likeTeacher(id){/** */}

    render(){
      // 如何排除参数组件不需要的属性？
      // 用剩余参数的方式将a排除，然后将剩余的props传递给WrapperComponent
      const {a, ...props} = this.props
      return(
        <>
          {
            // 使用新数据渲染被包装的组件。注意，可能还回传递其他属性
            <WrapperComponent
                data={this.state.listData}
                removeStudent={this.removeStudent.bind(this)}
                {...props}
            />
          }
        </>
      )
    }
  }
}
```
```javascript
// App.jsx
import StudentList from './components/StudentList.jsx'
import TeacherList from './components/TeacherList.jsx'
import listHoc from './components/ListHoc.jsx'

const StudentListHoc = listHoc(StudentList, fetchListData);
const TeacherListHoc = listHoc(TeacherList, fetchListData);

class App extends React.Component{
  state = {
    a: 1,
    b: 2,
    c: 3
  }
  render(){
    return(
      <div>
        <StudentListHoc {...this.state} />
      </div>
    )
  }
}
```

> 如何排除参数组件不需要的属性？

用剩余参数的方式将参数排除，然后将剩余的props传递给WrapperComponent

> 为什么不建议修改参数组件？


高阶组件中参数组件使用函数组件是否也能实现呢？


总结：
1. HOC更加关注逻辑于状态的管理，与参数组件的逻辑和状态的订阅（传东西进去）
2. 参数组件基本只需要关注试图的渲染



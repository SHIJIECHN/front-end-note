---
autoGroup-1: React
sidebarDepth: 3
title: 15. 高阶组件
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
以前使用mixins解决横切关注点的问题。但是有很多问题。

> 横切关注点是什么？

1. 对参数组件本身的**逻辑**与**视图**的横向切割
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
            // 使用新数据渲染被包装的组件。注意，可能还回传递其他属性，
            // 使用{...props}传递剩余参数
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
```javascript
function InputHoc(WrapperComponent){
  class InputHocComponent extends React.Component{
    render(){
      // 排除this.props中的属性a，将剩余参数传给WrapperComponent
      const { a, ...props } = this.props;

      return (
          <WrapperComponent {...props}/>
      )
    }
  }
  return InputHocComponent;
}

```

> 为什么不建议修改参数组件？

在高阶组件中重写参数组件componentDidUpdate方法，这会导致WrapperComponent里面的componentDidUpdate无法执行。通过这种方式覆盖了参数组件自身的componentDidUpdate方法。但是一切的功能都可以在容器组件内实现。
```javascript
// InputHoc
function InputHoc(WrapperComponent){
  // 不可以修改参数组件内的方法
  WrapperComponent.prototype.componentDidUpdate = function(){
    console.log('我是WrapperComponent')
  }

  class InputHocComponent extends React.Component{
    // 可以在这里实现componentDidUpdate
    componentDidUpdate(){
      console.log('我是Input H欧辰')
    }

    render(){
      return(
        <WrapperComponent />
      )
    }
  }
  return InputHocComponent;
}
```

高阶组件中参数组件使用函数组件是否也能实现呢？

高阶组件接受的参数组件可以是类组件也可以是函数组件，只要高阶组件最终返回的是JSX或者React元素即可.

## 总结
1. HOC更加关注逻辑于状态的管理，与参数组件的逻辑和状态的订阅（传东西进去）
2. 参数组件基本只需要关注试图的渲染


## 案例：选课表格列表
后端提供学生列表和教师列表两个数据

实现功能：
- 请求后端数据获取学生和教师列表
- 渲染学生列表
- 渲染教师列表
- 增减和删除操作
- 增加喜欢操作
- 常规写法
- 高阶组件写法

<img :src="$withBase('/framework/React/HOC.jpg')" alt="HOC" />

目录文件：
|-components
    |-ListHoc.jsx 高阶组件
    |-StudentList.jsx 学生列表组件
    |-TeacherList.jsx 老师咧白哦组件
|-model
    |-index.js 接口数据请求url
|-server 后端
    |-index.js 接口
    |-data
        |-course_all.json 所有课程信息 {id, field, course_name}
        |-sourse_fields.json 课程分类 {field, field_name}
        |-student.json 学生数据 {id, name, grade}
        |-teacher.json 老师数据 {id, name, subject, like}
|-index.js
|-package.json


> 常规写法有什么弊端

App组件把所有的数据暴露在跟App组件无关的地方，App组件的作用只是承载视图汇总，像请求数据，子组件需要的函数方法也在App组件里，这样会造成组件非常臃肿。

> 高阶组件写法如何实现

1. 抽离不相关的数据和方法
2. 封装一套程序方法兼容两个数据的请求


## 案例
|-App.jsx
|-components
    |-MyInput.jsx
    |-InputHoc.jsx

### 1. App.jsx   
```javascript
import MyInput from './components/MyInput.jsx'
import InputHoc from './components/InputHoc.jsx'

const MyInputHoc = InputHoc(MyInput);

class App extends React.Component {
  state = {
    a: 1,
    b: 2,
    c: 3
  }
  render() {
    return (
      // 如何排除MyInputHoc传入的不需要的属性
      <MyInputHoc {...this.state} />
    )
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('app')
)
```

### 2. MyInput.jsx
```javascript


// class MyInput extends React.Component {
//   // 相当于定义在MyInput.prototype.componentDidUpdate的原型方法
//   componentDidUpdate() {
//     console.log("我是MyInput")
//   }

//   render() {
//     return (
//       <div>
//         <h1>{this.props.inputValue}</h1>
//         <p>总计： {this.props.b + this.props.c}</p>
//         <input
//           type="text"
//           placeholder="请填写"
//           value={this.props.inputValue}
//           onChange={this.props.valueInput}
//         />
//       </div>
//     )
//   }
// }


// 高阶组件接受的组件参数可以是类组件也可以是函数组件
// 只要高阶组件最终返回的的JSX或者react元素就可以了
function MyInput(props) {
  // 实现每次inputValue发生改变，函数都会执行
  React.useEffect(() => {
    console.log('我是MyInput')
  }, [props.inputValue])

  return (
    <div>
      <h1>{props.inputValue}</h1>
      <p>总计： {props.b + props.c}</p>
      <input
        type="text"
        placeholder="请填写"
        value={props.inputValue}
        onChange={props.valueInput}
      />
    </div>
  )
}

export default MyInput;
```

### 3. InputHoc.jsx
```javascript
function InputHoc(WrapperComponent) {
  // 为什么不建议修改WrapperComponent组件？

  // 重写参数参数组件componentDidUpdate方法
  // 这就会导致WrapperComponent里面的componentDidUpdate无法执行
  // 通过这种方式相当于覆盖了参数组件里面的方法
  // WrapperComponent.prototype.componentDidUpdate = function () {
  //   console.log('我是InputHoc');
  // }

  // 高阶组件不能修改参数组件
  // 因为这样修改可能会导致参数组件内部的逻辑的执行失效
  // 一切的功能都可以在容器组件内实现
  class InputHocComponent extends React.Component {
    state = {
      inputValue: ''
    }

    // 可以直接在InputHocComponent里面写
    componentDidUpdate() {
      console.log('我是InputHoc')
    }

    valueInput(e) {
      this.setState({
        inputValue: e.target.value
      })
    }

    render() {
      // 如何排除参数组件不需要的属性？
      // 用剩余参数的方式将a排除，然后将剩余的props传递给WrapperComponent
      const { a, ...props } = this.props;

      return (
        <WrapperComponent
          inputValue={this.state.inputValue}
          valueInput={this.valueInput.bind(this)}
          {...props}
        />
      )
    }
  }
  // 可以自定义组件名称
  InputHocComponent.displayName = 'InputHoc';
  return InputHocComponent;
}

export default InputHoc;
```
---
autoGroup-2: Hook
sidebarDepth: 3
title: useContext
---

## useContext
与React.createContext的用法基本一直，接受一个context对象（React.createContext的返回值）并返回当前值，context的值向上层组件中距离当前组件最近的`<MyContext.Provider />`的value属性决定的。

```javascript
import React, { useContext } from 'react'
const themes = {
  light: {
    foreground: '#000000',
    background: '#222222'
  },
  dark: {
    foreground: '#ffffff',
    background: '#222222'
  }
}

const ThemeContext = React.createContext(themes.light);

function App() {
  return (
    // Provider 提供值
    <ThemeContext.Provider value={themes.dark}>
      <Toolbar />
    </ThemeContext.Provider>
  )
}

function Toolbar(props) {
  return (
    <div>
      <ThemedButton />
    </div>
  )
}

function ThemedButton() {
  // 获取值
  const theme = useContext(ThemeContext);
  return (
    <button style={{
      background: theme.background,
      color: theme.foreground
    }}>
      I am styled by theme context
    </button>
  )
}
```
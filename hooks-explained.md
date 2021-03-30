<p align=center>
<img width="50%" src="https://miro.medium.com/max/952/1*4khgguJQPxUwKSZH3URgQQ.png" />
</p>

<h1 align=center>React Hooks - 101</h1>

### Links:
* https://medium.com/@vcarl/everything-you-need-to-know-about-react-hooks-8f680dfd4349

### Table of contents:
* [Moving away from Class-Components](#moving-away-from-class-components)
* [Why hooks?](#xxx)
* [Importing Hooks](#xxx)
* [Rules to follow](#xxx)
* [A hook for every situation](#xxx)

## Moving away from Class-Components

React has shifted away from writing components(since `16.8`) as `class` towards `functional` components

> Classes confuse both people and machines: You have to understand how this works in JavaScript, which is very different from how it works in most languages. You have to remember to bind the event handlers etc.
Also, classes don’t minify very well, and they make hot reloading flaky and unreliable.

<table>
<tr>
  <th>Class</th>
  <th>Function</th>
</tr>
<tr>
<td>

```js
import React from 'react'

class Example extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0
    };
    
    this.bumpCount = this.bumpCount.bind(this)
  }

  componentDidMount() {
    document.title = `Clicked ${this.state.count} times`
  }

  componentDidUpdate(prevProps, prevState) {
    if( prevState.count !== this.state.count ) {
      document.title = `Clicked ${this.state.count} times`
    }
  }
  
  bumpCount(){
    this.setState({ count: this.state.count + 1 })
  }

  render() {
    return (
      <div>
        <p>You clicked {this.state.count} times</p>
        <button onClick={bumpCount}>Click me</button>
      </div>
    )
  }
}
```

</td>
<td valign="top">

```js
import React, { useState, useEffect, useCallback } from 'react'

function Example() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    document.title = `Clicked ${count} times`
  })
  
  const bumpCount = useCallback(() => {
    setCount(lastState => lastState + 1)
  }, [])

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={bumpCount}>Click me</button>
    </div>
  )
}
```

</td>
</tr>
</table>

## Why hooks?

React components almost always re-render at some point. Remember that every component is just a function, so whenever 
the component is called again, the function executes and a new scope within the function is created.

Hooks allows to ***persist*** values throughout those re-renders, so a component functionm can be called a 100 times
and still, inside it, variables crated using *hooks* will point to the same "thing".

React cares about what is returned from a functional component, which is JSX (most likely) and then React decides 
if changes took effect that should be rendered to the screen. A Component's function might get executed a 100 times
but the DOM will not change because there wasn't a real change in the JSX.

## Importing Hooks
```js
import React, { useState, useEffect, useCallback, ... } from 'react'
```

## Rules to follow

1. Hooks should be defined at the begining of a functional component, before other internal variables.
2. Hooks must be defined **outside** of a conditional `if` statement 
3. Hooks must be defined **before** any `return` statement
4. Hooks must be defined on the **top-level** of the function (component)
5. Always think about the *depencdencides* of the hooks (for those which have)


## A hook for every situation

| Often-used Hooks | Somewhat-used Hooks | Occasionally-used Hooks | Rarely-used Hooks     |
|------------------|---------------------|-------------------------|-----------------------|
| `useState`       | `useCallback`       | `useLayoutEffect`       | `useReducer`          |
| `useEffect`      | `useMemo`           | `useContext`            | `useImperativeHandle` |
|                  | `useRef`            |                         | `useDebugValue`       |

### `useState` - Basic state

#### Define component-level state
```js
const Example = ({ value = 1 }) => {
  // Es2015 Destructuring Assignment:
  const [myState, setMyState] = useState(value)
}
```

Can set as many `useState` as you want

#### Update (set) state
The state must only be updated using the second array item which the `useState(value)` returns.
This setter function is a special React function which, if called with a new value, will trigger a re-render
of the component so the new state value may be used in the next rendering cycle.

```js
const Example = ({ value = 1 }) => {
  const [counter, setCounter] = useState(value) // optional initial value

  const update = () => setCounter(state + 1) // 🚫 avoid directly using the last state when setting a new value
  const update = () => setCounter(lastValue => lastValue + 1) // ✅ use a function with the last value as the argument
  
  return <button onClick={update}>Counter {myState}</button>
}
```

When the state is of type `Array` or `Object` (or other exotic matter) always remember to deep-clone when setting a new state value:

```js
const [state, setState] = useState([1, 2, 3])

const update = () => 
  // add a new item to the array (at the end)
  setState(lastValue => [...lastValue, 4] )
```

### `useEffect` - Listening to changes in props or state (running side-effects code)

Can set as many `useEffect` as you want, each doing its own "job".
`useEffect` runs after the *first* render.


```js
const Example = ({ data = [], getServerData, id }) => {
  const [list, setList] = useState(data)
  
  useEffect(() => {
    // only gets fired once, when the component is first mounted.
    getServerData()
    
    // when the component unmounts, this will get executed:
    return () => {
      console.log('I am unmounting')
    }
  }, [])
  
  useEffect(() => {
    // whatever is here gets executed when the componted is first mounted 
    // and again if the "list" state changes
    window.scroll(0,0) // scrolls up to the top
  }, [list]) // <- a dependencies array
  
  useEffect(() => {
    console.log( id )
  }, [id])

  const update = () => setList(lastValue => lastValue + 1) 
  
  return <button onClick={update}>list {id}: {myState.join(",")}</button>
}
```

### `useCallback` - memoization of functions

```js
const Example = ({ value = 1 }) => {
  const [counter, setCounter] = useState(value) // optional initial value

  // every time "Example" is re-rendered, the "update" variable will point to 
  // the same function, and will not create a new one
  const update = useCallback(() => {
    setCounter(lastValue => lastValue + 1) 
  }, [])
  
  // this is important because the `update` variables never changes, therefore the <Child> compoent will not get a new "onClick" 
  // callback every time the <Example> component is re-rendred.
  return <Child onClick={update} />
}
```

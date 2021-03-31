<p align=center>
<img width="50%" src="https://miro.medium.com/max/952/1*4khgguJQPxUwKSZH3URgQQ.png" />
</p>

<h1 align=center>React Hooks - 101</h1>

### Links:
* [Everything you need to know about react hooks](https://medium.com/@vcarl/everything-you-need-to-know-about-react-hooks-8f680dfd4349)
* [Official Docs](https://reactjs.org/docs/hooks-reference.html)

### Table of contents:
* [Moving away from Class-Components](#hooks-explained.md#moving-away-from-class-components)
* [Why hooks?](#why-hooks)
* [Importing Hooks](#mporting-hooks)
* [Rules to follow](#rules-to-follow)
* [A hook for every situation](#a-hook-for-every-situation)
  * [useState](#useState)
  * [useEffect](#useEffect)
  * [useCallback](#useCallback)
  * [useMemo](#useMemo)
  * [useRef](#useRef)

## Moving away from Class-Components

React has shifted away from writing components (since `16.8`) as `class` towards `functional` components

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
import React, {useState, useEffect, useCallback} from 'react'

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

React components almost always re-render at some point. Remember that every component is **just a function**, so whenever 
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

<br><br>

### `useState` 
**Basic state**

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

<br><br>

### `useEffect` 
**Listening to changes in props or state (running side-effects code)**

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
  
  useEffect(() => {
     setList(data)
  }, [data])
  

  const update = () => setList(lastValue => [...lastValue, 1]) 
  
  return <button onClick={update}>list {id}: {list.join(",")}</button>
}
```

<br><br>

### `useCallback`
**memoization of functions**

Useful when definding function which will be passed down as props (to children components)

```js
const Example = ({ value = 1 }) => {
  const [counter, setCounter] = useState(value) // optional initial value

  // every time "Example" is re-rendered, the "update" variable will point to 
  // the same function, and will not create a new one
  const update = useCallback(() => {
    setCounter(lastValue => lastValue + 1) 
  }, [])

  // if the "value" prop is changed then set the counter to the new value (which will cause a re-render)
  useEffect(() => {
    setCounter(value)
  }, [value])
  
  // this is important because the `update` variables never changes, therefore the <Child> compoent will not get a new "onClick" 
  // callback every time the <Example> component is re-rendred.
  return <Child onClick={update} />
}
```

<br><br>

### `useMemo` 
**memoization of values returned by a function (similar to `useCallback`)**

Useful for expensive computations or to simply persist things across renders.

⚠️ `React.memo()` is not the same as the `useMemo` Hook and it used for shallow comparison of props.

```js
const Example = ({ data, sortComparator, filterPredicate }) => {
  const transformedData = useMemo(() => {
      return data
        .filter(filterPredicate)
        .sort(sortComparator)
    }, [data, sortComparator, filterPredicate])
    
  return <Table data={transformedData} />
}
```


<br><br>

### `useRef` 
**memoization of whatever across re-renders**

Useful for referencing the *exact* same thing (points to the same place in the memory).
Has the ability to be manipuated without causing a re-render.

It also allows saving references to DOM nodes rendered from the JSX.

This hook's value Can **only** be accessed by `.current` 

#### Logs the "name" prop only after at at least 5 times it was changed 
```js
function User({ name }) {
  const isMountedRef = useRef(1)

  useEffect(() => {
     if( isMountedRef.current >= 5 ){
       console.log( name )
     }
     
     isMountedRef.current++
  }, [name])

  return <div>{name}</div>
}
```

#### DOM refs - focus input after N seconds

```js
function User() {
  const inputRef = useRef()

  useEffect(() => {
    setTimeout(() =>  inputRef.current.focus(), 2000)
  }, [])

  return (
    <form>
      <input ref={inputRef} />
    </form>
  )
}
```

<br><br>

## Custom hooks

Share hooks' logic which is used (or might be used) in more than one component. Normally no JSX involved.

https://github.com/rehooks/awesome-react-hooks

<table>
<tr>
  <th>Hook</th>
  <th>Component</th>
</tr>
<tr>
<td>

```js
function useKeyPress( targetKey ) {
  // keeping track of whether key is pressed
  const [keyPressed, setKeyPressed] = useState(false)

  // If pressed key is our target key - set to true
  const downHandler = ({ key }) => {
    if (key === targetKey) 
      setKeyPressed(true)
  }

  // If released key is our target key - set to false
  const upHandler = ({ key }) => {
    if (key === targetKey) 
      setKeyPressed(false)
  }

  // Add event listeners
  useEffect(() => {
    window.addEventListener('keydown', downHandler)
    window.addEventListener('keyup', upHandler)
    
    // Remove event listeners on cleanup
    return () => {
      window.removeEventListener('keydown', downHandler)
      window.removeEventListener('keyup', upHandler)
    };
  }, [])

  return keyPressed
}

export default useKeyPress
```

</td>
<td valign="top">

```js
import useKeyPress from './useKeyPress'

// Usage
function App() {
  // Call hook for each key that we'd like to monitor
  const happyPress = useKeyPress('Enter')
  const escPress = useKeyPress('Escape')

  return <div>
      {happyPress && '😊'}
      {escPress && '😢'}
  </div>
}
```

</td>
</tr>
</table>



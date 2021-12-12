Applies CSS custom properties (variables) on a given element node

This global hook is also the core of the `<CSSVars>` component,
which is the declerative way of adding CSS variables to a component.

**Parameters**

| index   | type             | description
| ------- | ---------------  | ------------------------------------------------------------------------
| `0`     | arrayOf(element) | react `ref`
| `1`     | Object           | key/value props to apply as CSS custom properties on the node

If an Object `key`'s value is `undefined` or `null` the CSS variables will be removed via (`removeProperty`).

## Example:
```js
const Component = ({rotate, size}) => {
    const ref = useRef();
    useCSSVars(ref, {rotate, size});
    ...
}
```
The `<CSSVars/>` component can be used to wrap a single, or multiple components, and injecting
CSS variables (custom properties) by forwarding a ref. The wrapped components must be able to recieve a `ref` prop.

This wrapper component is using the global hook `useCSSVars` under-the-hood.

Any props which are set on this component will become CSS custmo properties (variables).
## Basic Example

```js
<CSSVars color='green' bg='lightgreen'>
    <Comp>Green</Comp>  /* Will have --color:green & --bg:lightgreen custom properties*/
</CSSVars>
```
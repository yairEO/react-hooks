import {useEffect} from 'react';

export const applyCSSVars= (ref, props) =>
    Object.entries(props).forEach(([k, v]) => {
        const action = v == null ? 'remove' : 'set';
        ref?.current?.style[action + 'Property']('--' + k, v);
    })

/**
 * Applies CSS custom properties (variables) on a given element node
 * @param {Object} ref react ref
 * @param {Object} props key/value props to apply as CSS custom properties on the node ref
 */
const useCSSVars = (ref, props) => {
    useEffect(() => {
        if (Array.isArray(ref.current))
            ref.current.forEach(r => applyCSSVars(r, props));
        else
            applyCSSVars(ref, props);
    }, [props, ref]);
}

export default useCSSVars;

import {useRef, createRef, Children, cloneElement} from 'react';
import {node} from 'prop-types';
import {useCSSVars} from 'hooks';

const CSSVars = ({children, ...props}) => {
    const refs = useRef([]);
    useCSSVars(refs, props);

    const withProps = Children.map(children, (child, i) => {
        // if child already has a ref, use it and don't create a new one
        refs.current[i] = child.ref
            ? child.ref
            : refs.current[i] ?? createRef();

        // for each child, add a "ref" prop or re-use existing one
        let p = {ref: refs.current[i]};

        // if the child is a "CSSVars" component, pass to it all the current
        // custom-proeprties props so they would be inherited
        if (child.type === CSSVars) {
            p = {...p, ...props, ...child.props};
        }

        return cloneElement(child, p)
    });

    return withProps;
};

CSSVars.propTypes = {
    children: node.isRequired,
};

export default CSSVars;

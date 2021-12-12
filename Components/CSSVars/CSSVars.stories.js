import React, {forwardRef, useEffect, useRef} from 'react';
import {storiesOf} from '@storybook/react';
import {story, readme} from 'storybook';
import CSSVars from './CSSVars';
import docs from './readme.md';
import './CSSVars.stories.scss';

const stories = storiesOf('Tools/CSSVars', module).add('Readme', readme(docs));

const Comp = forwardRef(({children}, ref) =>
    <div ref={ref}>{children}</div>
);

stories.add('Basic Example', story(docs, () => {
    const ref = useRef();

    useEffect(() => {
        if (ref.current?.style)
            ref.current.style.fontSize = '1.5em';
    }, [ref]);

    return (
        <CSSVars color='green' bg='lightgreen'>
            <Comp>Green</Comp>
            <Comp>Green</Comp>
            <div ref={ref}>Green large</div>
            <CSSVars color='red'>
                <Comp>
                    <span>Red text</span>
                </Comp>
            </CSSVars>
        </CSSVars>
    );
}));

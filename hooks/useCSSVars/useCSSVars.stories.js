import React, {useRef} from 'react';
import {storiesOf} from '@storybook/react';
import {story, readme} from 'storybook';
import * as knobs from '@storybook/addon-knobs';
import {useCSSVars} from '../';
import docs from './readme.md';

const stories = storiesOf('Hooks/Hooks', module).add('Readme', readme(docs));

stories.add('useCSSVars', story(docs, () => {
    const props = {
        withShadow: knobs.boolean('withShadow', false),
        size: knobs.number('size', undefined, {range: true, min: 12, max: 40, step: 1}),
    };

    const ref = useRef();
    useCSSVars(ref, props);
    return <div ref={ref}>Inspect this element while changing the story Knobs</div>;
}));

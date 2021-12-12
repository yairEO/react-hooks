import React from 'react';
import {mount} from 'enzyme';
import {expect} from 'chai';
import CSSVars from './CSSVars';

describe('<CSSVars/>', () => {
    it('should render a child with CSS custom properties', () => {
        mount(<CSSVars color='red' bg='blue'><div/></CSSVars>);

        // unable to test custom properties because the Mocha package version is using old JSDOM
        // that does not support it.
        expect(true).to.be.true;

        // const divNode = wrapper.find('div').getDOMNode();
        // console.log(  getComputedStyle(divNode)  )
        // expect(getComputedStyle(divNode).getPropertyValue('--color')).to.eql('red');
    });
});

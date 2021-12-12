import React from 'react';
import sinon from 'sinon';
import {expect} from 'chai';
import {mount} from 'enzyme';
import useCSSVars from './useCSSVars';

const Comp = ({xref, foo, bar}) => {
    useCSSVars(xref, {foo, bar});
    return null;
};

describe('useCSSVars()', () => {
    let ref;

    beforeEach(() => {
        ref = {
            current: {
                style : {
                    setProperty: sinon.spy(),
                    removeProperty: sinon.spy(),
                },
            },
        };
    });

    it('Should set/remove CSS custom properties (variables)', () => {
        const wrapper = mount(<Comp xref={ref} foo={1} bar={1}/>);
        const {current:{style:{setProperty, removeProperty}}} = ref;

        expect(removeProperty.callCount).to.eql(0);
        expect(setProperty.callCount).to.eql(2);
        expect(setProperty.getCall(0).calledWith('--foo', 1)).to.be.true;
        expect(setProperty.getCall(1).calledWith('--bar', 1)).to.be.true;

        wrapper.setProps({ foo: undefined });
        expect(removeProperty.callCount).to.eql(1);
        expect(removeProperty.getCall(0).calledWith('--foo')).to.be.true;
    });
});

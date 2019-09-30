import React from 'react';
import { Button } from '@material-ui/core';
import Adapter from 'enzyme-adapter-react-16';
import { configure, shallow } from 'enzyme';
import ExpUserNoLogin from '../ExpUserNotLogIn';

configure({adapter: new Adapter()});
describe("Testing <ExpUserNotLogin />", () => {
    it("There should be two buttons (Login and Register)", () => {
        const userNotLoginMockComp = shallow(<ExpUserNoLogin />);
        // Search for buttons
        const buttons = userNotLoginMockComp.findWhere(node => node.is(Button));
        // Verify number of buttons
        expect(buttons.length).toEqual(2);
    });

    it("Both Login and Register buttons should redirect to proper paths", () => {
        const userNotLoginMockComp = shallow(<ExpUserNoLogin />);
        // Search for buttons
        const buttons = userNotLoginMockComp.findWhere(node => node.is(Button));
        // Verify the path to where each button is supposed to be redirecting
        expect(buttons.get(0).props.to).toEqual("/login");
        expect(buttons.get(1).props.to).toEqual("/register");
    });

});
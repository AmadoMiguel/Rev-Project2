import React, { useState } from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { configure, shallow } from 'enzyme';
import Confirmation from '../Confirmation';
import MySnackbarContentWrapper from '../../SnackBarComponent';

// Mock Confirmation component props
const props = {
    open: false,
    close: jest.fn().mockImplementation(),
    message: "Successfully"
}

configure({adapter: new Adapter()});
describe("Testing <Confirmation />", () => {
    it("snackbar contains success message", () => {
        const confirmationMock = shallow(<Confirmation {...props} />);
        const snackBarContentMock = confirmationMock
        .findWhere(node => node.is(MySnackbarContentWrapper));
        expect(snackBarContentMock.prop("message")).toEqual("Successfully");
    });
});
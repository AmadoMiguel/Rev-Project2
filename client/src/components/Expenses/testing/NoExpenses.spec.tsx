import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import NoExpenses from '../NoExpenses';

// Mock props for the test
const props = {
    firstName:"Jack Black",
    types : [
        {id: 1,
        type: "Bills"},
        {id: 2,
        type: "Food"},
        {id: 3,
        type: "Emergency"},
        {id: 4, 
        type: "Entertainment"},
        {id: 5,
        type: "Other"}
    ],
    createExpense: jest.fn().mockImplementation(),
    view: false
}

configure({adapter: new Adapter()});
describe("Testing <NoExpenses />", () => {
    it("User first name should be rendered", () => {
        const noExpensesMock = shallow(<NoExpenses {...props} />);
        // Find the text of the header that should contain the user first name
        const fakeHeader2Text = noExpensesMock.find("h2").text();
        // If the index of appereance is not -1 means that the string is in the text
        expect(fakeHeader2Text.includes("Jack Black")).toBeTruthy();
    });
    
});
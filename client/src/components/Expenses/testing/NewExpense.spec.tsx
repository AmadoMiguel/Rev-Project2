import React from 'react';
import { shallow } from 'enzyme';
import { ExpenseType } from '../../../models/ExpenseType';
import NewExpense from '../NewExpenseDialog';
import Button from '@material-ui/core/Button';

// Mock dependencies for the NewExpense component test
// Props
// Array of expense types objects
const typesMock:ExpenseType[] = [
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
]
// Mock the implementation of the createExpense function
const createExpenseMock:Function = jest.fn().mockImplementation();
// Mock the current view (mobile/not mobile)
const viewMock:boolean = false;
// Create the props object
const props = {
    typesMock,
    createExpenseMock,
    viewMock
}

describe("testing <NewExpense />", () => {
    // Simulate the click on the button that pops-up the new expense dialog
    it("New expense dialog is rendered when button is clicked", () => {
        const newExpenseMock = shallow(<NewExpense {...props} />);
        const openButton = newExpenseMock.findWhere(node => node.is(Button) && node.prop("color")=="secondary");
        openButton.simulate("click");
    });
});
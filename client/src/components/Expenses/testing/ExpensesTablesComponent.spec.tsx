import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { configure, shallow } from 'enzyme';
import { Input } from '@material-ui/core';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';
import { ExpensesTable } from '../ExpensesTablesComponent';

// Mock props for test
const props = {
    expenses: [
        {
            id: 1,
            userId: 1,
            user: null,
            expenseType: {
                id: 1,
                type: "Bills"
            },
            date: new Date().toISOString(),
            description: "House services",
            amount: 110
        },
        {
            id: 2,
            userId: 1,
            user: null,
            expenseType: {
                id: 2,
                type: "Food"
            },
            date: new Date().toISOString(),
            description: "This weekend food",
            amount: 90
        }
    ],
    view: false,
    deleteExpense: jest.fn().mockImplementation(),
    updateExpense: jest.fn().mockImplementation()
}

configure({adapter: new Adapter()});
describe("Testing <ExpensesTablesComponent />", () => {
    it("The amount input field has 17px for font size when not in mobile view", () => {
        const mockExpensesTableComp = shallow(<ExpensesTable {...props}/>);
        // Find the amount input component
        const fakeAmountInput = mockExpensesTableComp
        .findWhere(node => node.is(Input) && node.prop("name") === "amount" );
        // Verify that the fontSize property of the style property is 17px
        expect(fakeAmountInput.get(0).props.style.fontSize).toEqual("17px");
    });
    // Check that there are three table rows (header and 2 expenses)
    it("There should be three table rows (header row + 2 mocked expenses)", () => {
        const mockExpensesTableComp = shallow(<ExpensesTable {...props}/>);
        // Find the table row components
        const fakeTableRows = mockExpensesTableComp.findWhere(node => node.is(TableRow));
        expect(fakeTableRows.length).toEqual(3);
    });
    // Verify that the key property of the two table rows on the table body, correspond
    // to the id of each expense
    it("table rows key matches expenses id", () => {
        const mockExpensesTableComp = shallow(<ExpensesTable {...props}/>);
        // Find table rows
        const fakeTableRows = mockExpensesTableComp.findWhere(node => node.is(TableRow));
        // Skip first table row (index 0) since is the header row
        expect(fakeTableRows.get(1).key).toEqual("1");
        expect(fakeTableRows.get(2).key).toEqual("2");
    });
    // Test that when pressing the delete button and the button on the delete confirmation
    // the function props.deleteExpense is called with the correspondig expense data
    it("deleting an expense works properly", () => {
        const mockExpensesTableComp = shallow(<ExpensesTable {...props}/>);
        // Find table row for the second expense
        const fakeTableRowForSecExp = mockExpensesTableComp
        .findWhere(node => node.is(TableRow) && node.key() === "2");
        // Get the delete button for that expense row
        const deleteButton = fakeTableRowForSecExp
        .findWhere(node => node.is(Button) && node.props().id === "delete-expense-button-2" );
        // Simulate a click event
        deleteButton.simulate("click");
        // Then find the delete confirmation button
        const deleteConfirmButton = mockExpensesTableComp
        .findWhere(node => node.is(Button) && node.prop("children") === "Delete");
        // Simulate a click event
        deleteConfirmButton.simulate("click");
        // verify that the props.deleteExpense function was called with the corresponding expense payload
        expect(props.deleteExpense).toHaveBeenCalledWith(props.expenses[1]);
    });
    // Test that updating the first expense works properly
    it("updating the first expense works properly and the payload is sent correctly", () => {
        const mockExpensesTableComp = shallow(<ExpensesTable {...props}/>);
        // Find the first expense row
        const firstExpenseRow = mockExpensesTableComp
        .findWhere(node => node.is(TableRow) && node.key() === "1");
        // Find the button to allow the table to be updated
        const updateExpenseButton = firstExpenseRow
        .findWhere(node => node.is(Button) && node.props().id === "update-expense-button-1");
        // Simulate a click event
        updateExpenseButton.simulate("click");
        // // Find only the amount input field and update it
        // const fakeAmountInput = firstExpenseRow
        // .findWhere(node => node.is(Input) && node.props().name === "amount");  
        // // Simulate a change on it
        // fakeAmountInput.simulate("change", {target: {name: "amount", value: 235.79}});
        // Find the update ok button
        const okUpdateButton = mockExpensesTableComp
        .findWhere(node => node.is(Button) && node.props().id === "ok-update-1");
        // Simulate a click on it
        okUpdateButton.simulate("click");
        // Now find the confirm update button
        const updateConfirmButton = mockExpensesTableComp
        .findWhere(node => node.is(Button) && node.prop("children") === "Update");
        // Simulate a click
        updateConfirmButton.simulate("click");
        // verify that the props.updateExpense function was called with the corresponding payload
        // check that the amount was changed properly
        expect(props.updateExpense).toHaveBeenCalledWith({...props.expenses[0]});
    });
});
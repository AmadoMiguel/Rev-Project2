import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { configure, shallow, mount } from 'enzyme';
import TablePerspective from '../TablePerspective';
import { Button } from '@material-ui/core';
import NewExpense from '../NewExpenseDialog';
import Select from '@material-ui/core/Select';
import { ExpensesTable } from '../ExpensesTablesComponent';
import { TextField } from '@material-ui/core';

// Mock props for the test
const props = {
    tableView: true,
    setShowTable: jest.fn().mockImplementation(),
    tabExpenses: [
        {
            id: 3,
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
            id: 7,
            userId: 1,
            user: null,
            expenseType: {
                id: 1,
                type: "Bills"
            },
            date: new Date().toISOString(),
            description: "Cellphone bill",
            amount: 90
        }
    ],
    delExpense: jest.fn().mockImplementation(),
    updExpense: jest.fn().mockImplementation(),
    types: [
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
    view: false,
    type: "Bills",
    loading: false
}

configure({adapter: new Adapter()});
describe("Testing <TablePerspective />", () => {
    it("when pressing the 'back' button, the table is hidden", () => {
        const mockTablePerspect = shallow(<TablePerspective {...props}/>);
        // Find the "back" button
        const fakeBackButton = mockTablePerspect
        .findWhere(node => node.is(Button) && node.prop("children") === "Back");
        // Simulate a click and verify the props.setShowTable(false) was called
        fakeBackButton.simulate("click");
        expect(props.setShowTable).toHaveBeenCalledWith(false);
    });
    it("The NewExpense component should have the current expense type", () => {
        const mockTablePerspect = shallow(<TablePerspective {...props}/>);
        // Find the NewExpense component
        const fakeNewExpense = mockTablePerspect.findWhere(node => node.is(NewExpense));
        // Get the type property
        const type = fakeNewExpense.prop("type");
        // Verify equality
        expect(type).toEqual("Bills");
    });
    it("Creating a new expense from the table perspective works properly", () => {
        const mockTablePerspect = shallow(<TablePerspective {...props}/>);
        // Find and shallow the NewExpense component
        const fakeNewExpense = mockTablePerspect.findWhere(node => node.is(NewExpense)).shallow();
        const openButton = fakeNewExpense
        .findWhere(node => node.is(Button) && node.prop("aria-label")=="add");
        // Fire the click event to open the dialog
        openButton.simulate("click");
        // Simulate the process of creating a new expense
        const fakeAmountTextField = fakeNewExpense
        .findWhere(node => node.is(TextField) && node.prop("name") === "amount");
        fakeAmountTextField.simulate("change", {target: {name: "amount", value: 200.5}});
        const fakeDateTextField = fakeNewExpense
        .findWhere(node => node.is(TextField) && node.prop("id") === "date");
        fakeDateTextField.simulate("change", {target:{name: "date", value: "2019-10-01"}});
        const fakeDescriptionTextField = fakeNewExpense
        .findWhere(node => node.is(TextField) && node.prop("name") == "description");
        fakeDescriptionTextField.simulate("change", {target:{name: "description", value:"Creating"}});
        // Search the Ok button for creating the expense
        const okButton = fakeNewExpense
        .findWhere(node => node.is(Button) && node.prop("children") === "Ok");
        // Simulate a click button on it
        okButton.simulate("click");
        // Verify call on props.createExpense
        expect(props.createExpense).toHaveBeenCalledWith(
            {id: 1, type: "Bills"},
            "Creating", 200.5, "2019-10-01"
        );
    });
    it("on table perspective, the expense type selector should not be rendered", () => {
        const mockTablePerspect = shallow(<TablePerspective {...props}/>);
        // Find the NewExpense component
        // The shallow method is required in order to search components within that component
        const fakeNewExpense = mockTablePerspect.findWhere(node => node.is(NewExpense)).shallow();
        // Find the Select component
        const fakeSelect = fakeNewExpense.findWhere(node => node.is(Select));
        // Vefiry existence on the node tree
        expect(fakeSelect.exists()).toBeFalsy();
    });
    // Test that deleting an expense at the expenses table component calls the parent function
    it("deleting an expense works appropriately from the expenses table perspective", () => {
        const mockTablePerspect = shallow(<TablePerspective {...props}/>);
        // Find the expenses table component
        const fakeExpensesTable = mockTablePerspect.findWhere(node => node.is(ExpensesTable)).shallow();
        // Find the delete button
        const fakeDeleteButton = fakeExpensesTable
        .findWhere(node => node.is(Button) && node.prop("id") === "delete-expense-button-7");
        // simulate a click event
        fakeDeleteButton.simulate("click");
        // Now find the delete confirmation button
        const deleteConfirmButton = fakeExpensesTable
        .findWhere(node => node.is(Button) && node.prop("children") === "Delete");
        // Simulate a click
        deleteConfirmButton.simulate("click");
        // Verify that the parent function was called with the corresponding payload
        expect(props.delExpense).toHaveBeenLastCalledWith(props.tabExpenses[1]);
    });
    it("when the page is loading, the expenses table should not be rendered", () => {
        // Set the loading state to true
        props.loading = true;
        const mockTablePerspect = shallow(<TablePerspective {...props}/>);
        // Find the table component node and verify it's not being not rendered
        const fakeExpensesTable = mockTablePerspect.findWhere(node => node.is(ExpensesTable));
        expect(fakeExpensesTable.exists()).toBeFalsy();
    });
});
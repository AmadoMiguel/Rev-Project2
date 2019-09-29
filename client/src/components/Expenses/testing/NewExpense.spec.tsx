import React from 'react';
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import NewExpense from '../NewExpenseDialog';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MenuItem from '@material-ui/core/MenuItem';
import { TextField } from '@material-ui/core';
import Select from '@material-ui/core/Select';

// Mock dependencies for the NewExpense component test
// Props
// Array of expense types objects
const types = [
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
const createExpense = jest.fn().mockImplementation();
// Mock the current view to be not mobile
const view = false;
// Mock the table view boolean
const tableView = false;
// Mock the current expense type (only valid when on table view perspective)
const type = "";
// Create the props object
const props = {
    types,
    createExpense,
    view,
    tableView, 
    type
}

configure({adapter: new Adapter()});
describe("testing <NewExpense />", () => {
    
    // Simulate the click on the button that pops-up the new expense dialog
    it("New expense dialog is rendered when add button is clicked", () => {
        const newExpenseMock = shallow(<NewExpense {...props}/>);
        // Find the button that will cause the dialog to pop-up
        const openButton = newExpenseMock.findWhere(node => node.is(Button) && node.prop("aria-label")=="add");
        // simulate a click in order to verify that the new expense dialog is popping up
        openButton.simulate("click");
        // Find the dialog component
        const dialog = newExpenseMock.findWhere(node => node.is(Dialog));
        expect(dialog.prop("open")).toBeTruthy();
    });

    // Test that the menu items for expense types exist (only one is enough)
    it("Bills expense type is an item of the expense types menu", () => {
        const newExpenseMock = shallow(<NewExpense {...props}/>);
        // Find the menu item for the bills expense type (key 1)
        const billsMenuItem = newExpenseMock
        .findWhere(node => node.is(MenuItem) && node.prop("children")==="Bills");
        expect(billsMenuItem.exists()).toBeTruthy();
    });

    // Test that the view property renders the expected text on the new expense dialog header
    it("h4 says 'Add New Expense' when not in mobile view", ()=> {
        const newExpenseMock = shallow(<NewExpense {...props}/>);
        // Search for the only h4 element that contains the title header of the new expense dialog
        const headerRow = newExpenseMock.find('h4').text();
        // Verify if the text is the expected one
        expect(headerRow).toEqual("Add New Expense");
    });

    // Test that the description text field has 5 rows enabled when not on mobile view
    it("description text field has 5 text rows enabled when not on mobile view", () => {
        const newExpenseMock = shallow(<NewExpense {...props}/>);
        // Find description text field
        const descriptionTextField = newExpenseMock
        .findWhere(node => node.is(TextField) && node.prop("name") === "description");
        expect(descriptionTextField.prop("rows")).toEqual(5);
    });

    // Test that when pressing the cancel button the new expense dialog is closed
    it("when clicking cancel button the new expense dialog closes", () => {
        const newExpenseMock = shallow(<NewExpense {...props}/>);
        // Find the button that will cause the dialog to pop-up
        const openButton = newExpenseMock.findWhere(node => node.is(Button) && node.prop("aria-label")=="add");
        // Fire the click event to open the dialog
        openButton.simulate("click");
        // Then find the button that will cause the dialog to close
        const cancelButton = newExpenseMock
        .findWhere(node => node.is(Button) && node.prop("children") == "Cancel");
        // Now simulate the cancel click to close the dialog
        cancelButton.simulate("click");
        // Find the dialog component
        const dialog = newExpenseMock.findWhere(node => node.is(Dialog));
        // New expense dialog should be closed after clicking the cancel button
        expect(dialog.prop("open")).toBeFalsy();
    });

    // Verify that creating a new expense works properly by prompting data on each field
    it("creating a new expense works properly by setting data on text fields", () => {
        const newExpenseMock = shallow(<NewExpense {...props}/>);
        // Find the button that will cause the dialog to pop-up
        const openButton = newExpenseMock.findWhere(node => node.is(Button) && node.prop("aria-label")=="add");
        // Fire the click event to open the dialog
        openButton.simulate("click");
        // Find the amount text field
        const amountTextField = newExpenseMock
        .findWhere(node => node.is(TextField) && node.prop("name") === "amount");
        // Simulate the amount field
        amountTextField.simulate("change", {target: {value: 200}});
        // Find the description text field
        const descriptionTextField = newExpenseMock
        .findWhere(node => node.is(TextField) && node.prop("name") === "description");
        // Simulate a change on the description field
        descriptionTextField.simulate("change", {target: {value: "Testing"}});
        // Find the expense type selector
        const typeSelector = newExpenseMock.findWhere(node => node.is(Select));
        // Simulate a change on the type selector
        typeSelector.simulate("change", {target: {value: 2}});

        // Find the submit button and simulate a click event
        const submitButton = newExpenseMock
        .findWhere(node => node.is(Button) && node.prop("children") === "Ok");
        submitButton.simulate("click");
        
        // Check if the props.createExpense was called (which means that the amount, description and
        // type are truthy values)
        expect(props.createExpense).toHaveBeenCalled();
    });

});
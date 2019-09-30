import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { configure, shallow } from 'enzyme';
import { Input } from '@material-ui/core';
import TableRow from '@material-ui/core/TableRow';
import { ExpensesTable } from '../ExpensesTablesComponent';
import { pencilTool, pencilPath, removeTool, removePath, undoTool, undoPath, okTool, okPath } from '../../../assets/Icons';

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
            date: new Date(),
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
            date: new Date(),
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
    // Check that there are two table rows (since only two expenses where defined in the mock)
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
    


});
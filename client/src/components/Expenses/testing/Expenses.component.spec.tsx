import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { configure, mount, shallow, ReactWrapper, ShallowWrapper } from 'enzyme';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import ExpensesComponent, { IExpenseProps, Expenses } from '../Expenses.component';
import { User } from '../../../models/User';
import { Expense } from '../../../models/Expense';
import DonutPerspective from '../DonutPerspective';
import { Paper } from '@material-ui/core';
import configureStore, { MockStoreCreator } from 'redux-mock-store';
import renderer, { ReactTestRenderer } from 'react-test-renderer';
import { Provider } from 'react-redux';
import promiseMiddleware from 'redux-promise-middleware';
import reduxThunk from 'redux-thunk';
import { BarLoader } from 'react-spinners';
import * as expensesReduxConfig from './../../../redux/reducers/expenses.reducer';
import * as expensesActions from './../../../redux/actions/expenses.actions';
import { render } from '@testing-library/react';
import TablePerspective from '../TablePerspective';
import NewExpense from './../NewExpenseDialog';
import { TextField } from '@material-ui/core';

// Mock all required properties (redux) and axios calls
// Mock the redux store with required middleware
const createStore = configureStore([reduxThunk]);
const userInfo:User = {
        id: 2, 
        firstName: "Post",
        lastName: "Man",
        email: "postman@mail.com",
        username: "postman",
        token: "ThisIsATokenMock"
}
const props =  {
    ui:{
        isMobileView: false
    },
    history:{},
    user : {
        userInfo: userInfo,
        isLoggedIn: true
    },
    userExpenses: {
        expenseTypes:[
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
        expenses: [
            {
                id:1, 
                userId:userInfo.id,
                user:userInfo,
                expenseType:{
                    id: 1,
                    type: "Bills"
                },
                date: new Date("03-09-2019"),
                description: "Phone bill",
                amount: 30
            },
            {
                id:2, 
                userId:userInfo.id,
                user:userInfo,
                expenseType:{
                    id: 2,
                    type: "Food"
                },
                date: new Date("03-10-2019"),
                description: "Last Revature lunch",
                amount: 20
            }
        ],
        expensesTotal:50,
        thisMonthExpenses: [
            {
                id:2, 
                userId:userInfo.id,
                user:userInfo,
                expenseType:{
                    id: 2,
                    type: "Food"
                },
                date: new Date("03-10-2019"),
                description: "Last Revature lunch",
                amount: 20
            }
        ],
        thisMonthExpensesTotal:20,
        thisYearTotalExpensesByMonth: [
            {
                month: "September",
                total: 30
            },
            {
                month: "October",
                total: 20
            }
        ]
    },
    setExpenses: jest.fn().mockImplementation(),
    setExpensesTotal: jest.fn().mockImplementation(),
    setThisMonthExpenses: jest.fn().mockImplementation(),
    setThisMonthExpensesTotal: jest.fn().mockImplementation(),
    setThisYearExpensesTotalByMonth: jest.fn().mockImplementation()
}
// Create a new fake expense in order to mock the axios post (create) method
const newFakeExpense:any = {
    userId: props.user.userInfo.id,
    expenseType: {
        id: 4,
        type: "Entertainment"
    },
    date: "10-10-2019",
    description: "Testing",
    amount: 100
}
// Mock axios module
const mockAdapter = new MockAdapter(axios);

configure({adapter: new Adapter()});
describe("Testing <Expenses />", () => {
    describe("initial rendering", () => {
        let store:any;
        let expensesComponentRenderMock:ReactTestRenderer;
        let expensesCompMock: ReactWrapper<IExpenseProps, any>
        beforeEach(() => {
            // Create the redux store mock
            store = createStore(props);
            // Mock the expenses component
            expensesComponentRenderMock = renderer.create(
                <Provider store = {store}>
                    <ExpensesComponent {...props}/>
                </Provider>
            );
            expensesCompMock = mount(<Expenses {...props} />);
        });
        afterEach(() => {
            expensesComponentRenderMock.unmount();
            expensesCompMock.unmount();
        });
        it("bar loader component should render first on expenses component", () => {
            const barLoaderMock = expensesComponentRenderMock.root
            .findByType("div").findByType(Paper).findByType("div").findByType(BarLoader);
            expect(barLoaderMock).toBeDefined();
        });
        it("donut should render properly, table should be hidden", () => {    
            const donutPerspMock = expensesCompMock.findWhere(
                node => node.is(DonutPerspective)
            );
            expect(donutPerspMock.exists()).toBeTruthy();
            const tablePerspMock = expensesCompMock.findWhere(
                node => node.is(TablePerspective)
            );
            expect(tablePerspMock.exists()).toBeFalsy();
        });
    });
    describe("methods for expenses component should be called properly", () => {
        let store: any;
        let expensesCompMock: ReactWrapper<IExpenseProps, any>;
        beforeEach(() => {
            store = createStore(props);
            expensesCompMock = mount(<Provider store = {store}>
                                        <Expenses {...props}/>
                                    </Provider>);
            mockAdapter.onPost('http://localhost:8765/expense-service/expense',newFakeExpense)
            .reply(200, {...newFakeExpense, id: 3, user: userInfo});
        });
        afterEach(() => {
            expensesCompMock.unmount();
        })
        it("set expenses totals should be calculated when pre-rendering component", () => {
            expect(props.setExpensesTotal).toHaveBeenCalledWith(props.userExpenses.expensesTotal);
            expect(props.setThisMonthExpensesTotal)
            .toHaveBeenCalledWith(props.userExpenses.thisMonthExpensesTotal);
        });
        // Simulate creation of new expense
        it("set expenses should be called properly when adding a new expense", () => {
            // Retrieve donut perspective component
            const donutPerspectiveMock = expensesCompMock
            .findWhere(node => node.is(DonutPerspective));
            // Check it's rendered properly
            expect(donutPerspectiveMock.exists()).toBeTruthy();
            // Get the new expense component and check if is rendered properly
            const newExpenseMock = donutPerspectiveMock
            .findWhere(node => node.is(NewExpense));
            expect(newExpenseMock.exists()).toBeTruthy();
            // Call create expense function
            newExpenseMock.props().createExpense(newFakeExpense.expenseType, newFakeExpense.description,
                newFakeExpense.amount,newFakeExpense.date);
            expect(props.setExpenses).toBeCalled();
        });
    });
});
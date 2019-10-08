import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { configure, mount, shallow, ReactWrapper, ShallowWrapper } from 'enzyme';
import axios from 'axios';
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
const newFakeExpense:Expense = {
    id: 3,
    userId: props.user.userInfo.id,
    user: props.user.userInfo,
    expenseType: {
        id: 4,
        type: "Entertainment"
    },
    date: new Date(),
    description: "Testing",
    amount: 100
}


configure({adapter: new Adapter()});
describe("Testing <Expenses />", () => {
    describe("initial rendering", () => {
        let store:any;
        let expensesComponentRenderMock:ReactTestRenderer;
        beforeEach(() => {
            // Create the redux store mock
            store = createStore(props);
            // Mock the expenses component
            expensesComponentRenderMock = renderer.create(
                <Provider store = {store}>
                    <ExpensesComponent {...props}/>
                </Provider>
            );
        });
        afterEach(() => {
            expensesComponentRenderMock.unmount();
        });
        it("bar loader component should render first on expenses component", () => {
            const barLoaderMock = expensesComponentRenderMock.root
            .findByType("div").findByType(Paper).findByType("div").findByType(BarLoader);
            expect(barLoaderMock).toBeDefined();
        });
    });
    describe("redux actions for expenses component should be called properly", () => {
        let store: any;
        let expensesCompMock:ShallowWrapper<IExpenseProps,any>;
        let useEffect:any;
        const mockUseEffect = () => {
            useEffect.mockImplementationOnce((f:any) => f());
        }
        beforeEach(() => {
            useEffect = jest.spyOn(React, "useEffect");
            mockUseEffect();
            mockUseEffect();
            // Recall initial state from the expenses reducer in order to test actions
            store = createStore(props);
        });
        // Testing actions only in redux layer
        it("expenses totals actions should send the correct payload when dispatched", () => {
            const expectedActions = [
                {
                    type:expensesActions.expensesActionTypes.SET_EXPENSES_TOTAL,
                    expensesTotal: props.userExpenses.expensesTotal
                },
                {
                    type:expensesActions.expensesActionTypes.SET_THIS_MONTH_EXPENSES_TOTAL,
                    thisMonthExpensesTotal: props.userExpenses.thisMonthExpensesTotal
                }
            ]
            store.dispatch(expensesActions.setExpensesTotal(
                props.userExpenses.expenses
                .map((e: Expense) => Math.round(e.amount)).reduce((a: any, b: any) => a + b)
            ));
            store.dispatch(expensesActions.setThisMonthExpensesTotal(
                props.userExpenses.thisMonthExpenses
                .map((e: Expense) => Math.round(e.amount)).reduce((a: any, b: any) => a + b)
            ));
            expect(store.getActions()).toEqual(expectedActions);
        });
        it("expenses total should be calculated when pre-rendering component", (done) => {    
            
        });
    });
});
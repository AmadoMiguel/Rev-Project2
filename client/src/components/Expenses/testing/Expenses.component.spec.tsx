import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { configure, mount, shallow, ReactWrapper } from 'enzyme';
import axios from 'axios';
import ExpensesComponent, { IExpenseProps } from '../Expenses.component';
import { User } from '../../../models/User';
import { Expense } from '../../../models/Expense';
import DonutPerspective from '../DonutPerspective';
import { Paper } from '@material-ui/core';
import configureStore from 'redux-mock-store';
import renderer, { ReactTestRenderer } from 'react-test-renderer';
import { Provider } from 'react-redux';
import promiseMiddleware from 'redux-promise-middleware';
import reduxThunk from 'redux-thunk';
import { BarLoader } from 'react-spinners';

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
        it("bar loader component should render first on expenses component", () => {
            // Mock the expenses component
            let setIsLoading:(state:boolean) => void;
            const useEffectSpy = jest.spyOn(React, "useEffect");
            useEffectSpy.mockImplementationOnce(() => {
                setIsLoading(false);
            });
            const store = createStore(props);
            const expensesComponentRenderMock = renderer.create(
                <Provider store = {store}>
                    <ExpensesComponent {...props}/>
                </Provider>
            );
            const barLoaderMock = expensesComponentRenderMock.root
            .findByType("div").findByType(Paper).findByType("div").findByType(DonutPerspective);
            expect(barLoaderMock).toBeDefined();
        });
    });
    // describe("redux actions for expenses total should be called properly", () => {
        

    // });
});
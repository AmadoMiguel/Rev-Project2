import { expensesActionTypes } from '../actions/expenses.actions';
import { IExpensesState } from '..';

const initialState:IExpensesState = {
    expenses:[{
        id: 0,
        userId: 0,
        user: {
            id: 0,
            username:"",
            firstName: "",
            lastName: "",
            email:"",
            token:""
        },
        expenseType: {
            id: 0,
            type: ""
        },
        date: new Date(),
        description: "",
        amount: 0
    }],
    expenseTypes:[
        {
            id: 0,
            type: ""
        }
    ],
    thisMonthExpenses:[{
        id: 0,
        userId: 0,
        user: {
            id: 0,
            username:"",
            firstName: "",
            lastName: "",
            email:"",
            token:""
        },
        expenseType: {
            id: 0,
            type: ""
        },
        date: new Date(),
        description: "",
        amount: 0
    }],
    expensesTotal:0,
    thisMonthExpensesTotal:0,
    thisYearTotalExpensesByMonth:
    [
        {
            month: "",
            total: 0
        }
    ]
};

// Define what actually happens when a specific action is dispatched.
// Reducers must be pure functions, therefore do not alter
// state directly within them. Construct and return a new state.
export const setExpensesInfoReducer = (state:IExpensesState = initialState, action: any) => {
    switch (action.type) {
        case expensesActionTypes.SET_EXPENSES:
            return {
                ...state,
                expenses: action.expenses
            }
        case expensesActionTypes.SET_EXPENSE_TYPES:
            return {
                ...state,
                expenseTypes: action.expenseTypes
            }
        case expensesActionTypes.SET_THIS_MONTH_EXPENSES:
            return {
                ...state,
                thisMonthExpenses: action.thisMonthExpenses
            }
        case expensesActionTypes.SET_EXPENSES_TOTAL:
            return {
                ...state,
                expensesTotal: action.expensesTotal
            }
        case expensesActionTypes.SET_THIS_MONTH_EXPENSES_TOTAL:
            return {
                ...state,
                thisMonthExpensesTotal: action.thisMonthExpensesTotal
            }       
        case expensesActionTypes.SET_THIS_YEAR_TOTAL_MONTHLY_EXPENSES:
            return {
                ...state,
                thisYearTotalExpensesByMonth: action.thisYearTotalExpensesByMonth
            }
        default: return state;
    }
}
import { expensesActionTypes } from '../actions';

const initialState = {
    expenses:null,
    expenseTypes:null,
    thisMonthExpenses:null,
    expensesTotal:0,
    thisMonthExpensesTotal:0
};

// Define what actually happens when a specific action is dispatched.
// Reducers must be pure functions, therefore do not alter
// state directly within them. Construct and return a new state.
export const setExpensesInfoReducer = (state = initialState, action: any) => {
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
        default: return state;
    }
}
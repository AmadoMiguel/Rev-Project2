// Action types, i.e what action is to be done
export const userActionTypes = {
    UPDATE_USER_LOGGED_IN: 'UPDATE_USER_LOGGED_IN',
    UPDATE_USER_INFO: 'UPDATE_USER_INFO'
}

export const uiActionTypes = {
    SET_MOBILE_VIEW: 'SET_MOBILE_VIEW'
}

export const expensesActionTypes = {
    SET_EXPENSES: "SET_EXPENSES",
    SET_EXPENSE_TYPES: "SET_EXPENSE_TYPES",
    SET_THIS_MONTH_EXPENSES: "SET_THIS_MONTH_EXPENSES",
    SET_EXPENSES_TOTAL: "SET_EXPENSES_TOTAL",
    SET_THIS_MONTH_EXPENSES_TOTAL: "SET_MONTHLY_EXPENSES_TOTAL"
}

// Our actions will automatically dispatch to the reducers.
// Define what data we are sharing.
// Actions related to the user information and if she/he logged in already
export const updateUserLoggedIn = (val: boolean) => (dispatch: any) => {
    dispatch({
        type: userActionTypes.UPDATE_USER_LOGGED_IN,
        isLoggedIn: val
    })
}

export const updateUserInfo = (payload: any) => (dispatch: any) => {
    dispatch({
        type: userActionTypes.UPDATE_USER_INFO,
        payload: payload
    })
}
// Action related to the mobile responsiveness
export const setMobileView = (val: boolean) => (dispatch: any) => {
    dispatch({
        type: uiActionTypes.SET_MOBILE_VIEW,
        isMobileView: val
    })
}

// Actions related to the user expenses information
export const setExpenses = (expenses:any) => (dispatch:any) => {
    dispatch({
        type: expensesActionTypes.SET_EXPENSES,
        expenses:expenses
    })
}
export const setExpenseTypes = (expenseTypes:any) => (dispatch:any) => {
    dispatch({
        type: expensesActionTypes.SET_EXPENSE_TYPES,
        expenseTypes:expenseTypes
    })
}
export const setThisMonthExpenses = (thisMonthExpenses:any) => (dispatch:any) => {
    dispatch({
        type: expensesActionTypes.SET_THIS_MONTH_EXPENSES,
        thisMonthExpenses:thisMonthExpenses
    })
}
export const setExpensesTotal = (expensesTotal:number) => (dispatch:any) => {
    dispatch({
        type: expensesActionTypes.SET_EXPENSES_TOTAL,
        expensesTotal:expensesTotal
    })
}
export const setThisMonthExpensesTotal = (thisMonthExpensesTotal:number) => (dispatch:any) => {
    dispatch({
        type: expensesActionTypes.SET_THIS_MONTH_EXPENSES_TOTAL,
        thisMonthExpensesTotal:thisMonthExpensesTotal
    })
}
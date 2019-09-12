export const expensesActionTypes = {
    SET_EXPENSES: "SET_EXPENSES",
    SET_EXPENSE_TYPES: "SET_EXPENSE_TYPES",
    SET_THIS_MONTH_EXPENSES: "SET_THIS_MONTH_EXPENSES",
    SET_EXPENSES_TOTAL: "SET_EXPENSES_TOTAL",
    SET_THIS_MONTH_EXPENSES_TOTAL: "SET_MONTHLY_EXPENSES_TOTAL",
    SET_THIS_YEAR_TOTAL_MONTHLY_EXPENSES: "SET_THIS_YEAR_TOTAL_MONTHLY_EXPENSES"
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

export const setThisYearExpensesTotalByMonth = (thisYearTotalExpensesByMonth:any) => (dispatch:any) => {
    dispatch({
        type: expensesActionTypes.SET_THIS_YEAR_TOTAL_MONTHLY_EXPENSES,
        thisYearTotalExpensesByMonth:thisYearTotalExpensesByMonth
    })
}
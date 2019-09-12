import { combineReducers } from "redux";
import { updateUserReducer } from "./reducers/user.reducer";
import { updateUiReducer } from "./reducers/ui.reducer";
import { setExpensesInfoReducer } from "./reducers/expenses.reducer";
import { Budget } from "../models/Budget";
import { MonthExpensesTotal } from "../models/MonthExpensesTotal";
import { Expense } from "../models/Expense";
import { ExpenseType } from "../models/ExpenseType";
import { BudgetType } from "../models/BudgetType";
import { setBudgetsInfoReducer } from "./reducers/budgets.reducer";
import { IncomeType } from "../models/IncomeType";
import { Income } from "../models/Income";

// Interfaces for every state we want to use
// Need more user data, add it here
export interface IUserState {
    isLoggedIn: boolean,
    // userInfo:User
    id: number,
    first: string,
    last: string,
    username: string,
    email: '',
    token: string
}

// Redux interfaces for budgets, expenses and incomes
export interface IBudgetsState {
    budgets: Budget[],
    budgetTypes: BudgetType[]
}

export interface IExpensesState {
    expenses:Expense[],
    expenseTypes:ExpenseType[],
    thisMonthExpenses:Expense[],
    thisYearTotalExpensesByMonth: MonthExpensesTotal[],
    expensesTotal:number,
    thisMonthExpensesTotal:number
}

export interface IIncomesState {
    incomes:Income[],
    incomeTypes:IncomeType[]
}

// User interface size redux interface for mobile responsiveness
export interface IUiState {
    isMobileView: boolean
}

// Interface for combination of every previous state
export interface IState {
    user: IUserState,
    ui: IUiState,
    userExpenses:IExpensesState,
    userBudgets:IBudgetsState
}

// Combine all reducers into one
export const state = combineReducers<IState>({
    user: updateUserReducer,
    ui: updateUiReducer,
    userExpenses:setExpensesInfoReducer,
    userBudgets:setBudgetsInfoReducer
})
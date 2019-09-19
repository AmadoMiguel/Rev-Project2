import { Budget } from "../../models/Budget";
import { BudgetType } from "../../models/BudgetType";

export const budgetsActionsTypes = {
    SET_BUDGETS: "SET_BUDGETS",
    SET_BUDGET_TYPES: "SET_BUDGET_TYPES"
}

export const setBudgets = (budgets:Budget[]) => (dispatch:any) => {
    dispatch({
        type: budgetsActionsTypes.SET_BUDGETS,
        budgets:budgets
    })
}

export const setBudgetTypes = (budgetTypes:BudgetType[]) => (dispatch:any) => {
    dispatch({
        type: budgetsActionsTypes.SET_BUDGET_TYPES,
        budgetTypes: budgetTypes
    })
}
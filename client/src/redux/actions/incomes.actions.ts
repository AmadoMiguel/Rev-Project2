import { Income } from "../../models/Income";
import { IncomeType } from "../../models/IncomeType";

export const incomesActionsTypes = {
    SET_INCOMES:"SET_INCOMES",
    SET_INCOME_TYPES:"SET_INCOME_TYPES"
}

export const setIncomes = (incomes:Income[]) => (dispatch:any) => {
    dispatch({
        type: incomesActionsTypes.SET_INCOMES,
        incomes:incomes
    })
}

export const setIncomeTypes = (incomeTypes:IncomeType[]) => (dispatch:any) => {
    dispatch({
        type: incomesActionsTypes.SET_INCOME_TYPES,
        incomeTypes:incomeTypes
    })
}
import { IBudgetsState, state } from "..";
import { budgetsActionsTypes } from "../actions/budgets.actions";


const initialState:IBudgetsState = {
    budgets:[
        {
            id:0,
            userId:0,
            amount:0,
            budgetType:{
                id:0,
                type:""
            }
        }
    ],
    budgetTypes:[
        {
            id:0,
            type:""
        }
    ]
}

export const setBudgetsInfoReducer = (state:IBudgetsState = initialState, action:any) => {
    switch(action.type) {
        case budgetsActionsTypes.SET_BUDGETS:
            return { 
                ...state,
                budgets:action.budgets
            }
        case budgetsActionsTypes.SET_BUDGET_TYPES:
            return {
                ...state,
                budgetTypes:action.budgetTypes
            }
        default: return state;
    }
}
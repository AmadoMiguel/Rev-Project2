import { IIncomesState } from "..";
import { incomesActionsTypes } from "../actions/incomes.actions";


const initialState:IIncomesState = {
    incomes: [{
        id:0,
        userId:0,
        incomeType:{
            id:0,
            type:""
        },
        description:"",
        amount:0
    }],
    incomeTypes:[{
        id:0,
        type:""
    }]
}

export const setIncomesReducer = (state:IIncomesState = initialState, action:any) => {
    switch(action.type) {
        case incomesActionsTypes.SET_INCOMES:
            return {
                ...state,
                incomes:action.incomes
            }
        case incomesActionsTypes.SET_INCOME_TYPES:
            return {
                ...state,
                incomeTypes:action.incomeTypes
            }
        default: return state
    }
}
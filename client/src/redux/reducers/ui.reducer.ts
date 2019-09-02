import { uiActionTypes } from "../actions";

const initialState = {
    isMobileView: !window.matchMedia('(min-width: 700px)').matches
};

// Define what actually happens when a specific action is dispatched.
// Reducers must be pure functions, therefore do not alter
// state directly within them. Construct and return a new state.
export const updateUiReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case uiActionTypes.SET_MOBILE_VIEW:
            return {
                ...state,
                isMobileView: action.isMobileView
            }
        default: return state;
    }
}
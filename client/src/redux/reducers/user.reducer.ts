import { userActionTypes } from '../actions';

const initialState = {
    isLoggedIn: false,
    // Personal user info and jwt
    id: 0,
    first: '',
    last: '',
    username: '',
    email: '',
    token: ''
};

// Define what actually happens when a specific action is dispatched.
// Reducers must be pure functions, therefore do not alter
// state directly within them. Construct and return a new state.
export const updateUserReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case userActionTypes.UPDATE_USER_LOGGED_IN:
            return {
                ...state,
                isLoggedIn: action.isLoggedIn
            }
        case userActionTypes.UPDATE_USER_INFO:
            return {
                ...state,
                ...action.payload
            }
        default: return state;
    }
}

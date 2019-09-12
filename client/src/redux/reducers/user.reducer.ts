import { userActionTypes } from '../actions/user.actions';
import { IUserState } from '..';

const initialState:IUserState = {
    isLoggedIn: false,
    // Personal user info and jwt
    userInfo:{
        id: 0,
        username:"",
        firstName: "",
        lastName: "",
        email:"",
        token:""
    }
};

// Define what actually happens when a specific action is dispatched.
// Reducers must be pure functions, therefore do not alter
// state directly within them. Construct and return a new state.
export const updateUserReducer = (state:IUserState = initialState, action: any) => {
    switch (action.type) {
        case userActionTypes.UPDATE_USER_LOGGED_IN:
            return {
                ...state,
                isLoggedIn: action.isLoggedIn
            }
        case userActionTypes.UPDATE_USER_INFO:
            return {
                ...state,
                userInfo:action.userInfo
            }
        default: return state;
    }
}

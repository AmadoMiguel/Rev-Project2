import { User } from "../../models/User";

// Action types, i.e what action is to be done
export const userActionTypes = {
    UPDATE_USER_LOGGED_IN: 'UPDATE_USER_LOGGED_IN',
    UPDATE_USER_INFO: 'UPDATE_USER_INFO'
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

export const updateUserInfo = (userInfo: User) => (dispatch: any) => {
    dispatch({
        type: userActionTypes.UPDATE_USER_INFO,
        userInfo: userInfo
    })
}
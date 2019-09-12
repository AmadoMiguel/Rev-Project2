export const uiActionTypes = {
    SET_MOBILE_VIEW: 'SET_MOBILE_VIEW'
}

// Action related to the mobile responsiveness
export const setMobileView = (val: boolean) => (dispatch: any) => {
    dispatch({
        type: uiActionTypes.SET_MOBILE_VIEW,
        isMobileView: val
    })
}
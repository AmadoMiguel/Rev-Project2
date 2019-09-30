import React from 'react';
import MySnackbarContentWrapper from '../SnackBarComponent';
import Snackbar from '@material-ui/core/Snackbar';

function Confirmation(props:any) {
    return (
        <Snackbar
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
            }}
            open={props.open}
            autoHideDuration={5000}
            onClose={props.close}
        >
            <MySnackbarContentWrapper
            variant="success"
            message={props.message} />
        </Snackbar>
    )
}

export default Confirmation;
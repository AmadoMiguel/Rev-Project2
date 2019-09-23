import React from 'react';
import colors from '../../assets/Colors';
import { Button } from '@material-ui/core';
import { Link } from 'react-router-dom';

function ExpUserNoLogin() {
    return (
        <div
            style={{
            marginTop: '50px', marginRight: 'auto', marginLeft: 'auto', textAlign: 'center',
            color: colors.offWhite, width: "60%"
            }}>
            <h2 style={{ marginBottom: '40px' }}>
            With <strong>Budgy</strong> you can schedule your expenses by
                category, specifying amount and description. <br />
            That way you won´t forget them.
                <br /><br />To get started,
                </h2>
            <Button style={{ border: `1px solid ${colors.offWhite}`, color: colors.offWhite }}
                variant='text' component={Link} to='/login'>
                Login
            </Button>
            <b style={{ marginLeft: '10px', marginRight: '10px' }}>or</b>
            <Button component={Link} to='/register' style={{ backgroundColor: colors.orange }}>
            Register
                </Button>
        </div>
    )
}

export default ExpUserNoLogin;


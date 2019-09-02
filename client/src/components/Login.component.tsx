import React, { useState, useEffect } from 'react';
import { Paper, Button, Divider, TextField } from '@material-ui/core';
import { IUserState, IState, IExpensesState } from '../redux';
import { updateUserLoggedIn, updateUserInfo, setExpenses, setExpenseTypes, setThisMonthExpenses } from '../redux/actions';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';
import Axios from 'axios';

interface ILoginProps {
  user: IUserState;
  updateUserInfo: (payload: any) => void;
  updateUserLoggedIn: (val: boolean) => void;
  userExpenses: IExpensesState;
  setExpenses: (expenses:any) => void;
  setExpenseTypes: (expenseTypes:any) => void;
  setThisMonthExpenses: (thisMonthExpenses:any) => void;
  history: any;
}

export function Login(props: ILoginProps) {
  const [usernameField, setUsernameField] = useState('');
  const [usernameError, setUsernameError] = useState(false);
  const [usernameErrorTxt, setUsernameErrorTxt] = useState('');
  const [pwField, setPwField] = useState('');
  const [pwError, setPwError] = useState(false);
  const [pwErrorTxt, setPwErrorTxt] = useState('');

  useEffect(() => {
    setUsernameError(false);
    setPwError(false);
  }, [])

  // As soon as user logs in, request expenses information about her/him
  async function getUserExpensesInfo(userId:number) {
    // User expenses info connected to redux
    let url = `http://localhost:8080/expense/user/${userId}`;
    if (!props.userExpenses.expenses) { 
      await Axios.get(url)
        .then((payload: any) => {
          payload.data.length > 0 && props.setExpenses(payload.data);
        }).catch((err: any) => {
          // Handle error by displaying something else
        });
    }
    if (!props.userExpenses.thisMonthExpenses) {
      url = `http://localhost:8080/expense/user/${userId}/monthly`;
      await Axios.get(url)
        .then((payload: any) => {
          payload.data.length > 0 && props.setThisMonthExpenses(payload.data);
        }).catch((err: any) => {
          // Handle error by displaying something else
        });
    }
    url = `http://localhost:8080/expense/types`;
    await Axios.get(url)
      .then((payload: any) => {
        payload.data.length > 0 && props.setExpenseTypes(payload.data);
      }).catch((err: any) => {
        // Handle error by displaying something else
      });
    // After all information is stored, head user to the overview page
    props.userExpenses.expenseTypes && 
      props.history.push('/');
  }

  async function logIn() {
    const url = 'http://localhost:8080/login';
    await Axios.post(url, {
      username: usernameField,
      password: pwField,
    }).then(payload => {
      setPwError(false);
      setUsernameError(false);
      //Do something will payload
      props.updateUserInfo(payload.data);
      // Request user expenses info
      getUserExpensesInfo(payload.data.id);
      props.updateUserLoggedIn(true);
    }).catch(err => {
      setUsernameError(true);
      setUsernameErrorTxt('');
      setPwError(true);
      setPwErrorTxt('Incorrect Username or Password!');
    });
  }

  const handleUsernameInput = (e: any) => {
    setUsernameField(e.target.value);
    setUsernameError(false);
    setPwError(false);
  }

  const handlePwInput = (e: any) => {
    setPwField(e.target.value);
    setPwError(false);
    setUsernameError(false);
  }
  // Check if information is properly filled in order to proceed
  const handleLogin = () => {
    if (!usernameField) {
      setUsernameError(true);
      setUsernameErrorTxt('Missing field');
    }
    if (!pwField) {
      setPwError(true);
      setPwErrorTxt('Missing field');
    }
    if (usernameField && pwField) logIn();
  }

  return (
    props.user.isLoggedIn ? <Redirect push to='/user' /> :
      <div style={{ marginTop: '50px', textAlign: 'center' }}>
        <Paper style={{ display: 'inline-block', padding: '50px' }}>
          <h2>Welcome</h2>
          <div onKeyPress={(e: any) => {
            if (e.key === 'Enter') {
              handleLogin();
            }
          }}>
            <Divider style={{ marginBottom: '25px' }} />
            <TextField
              error={usernameError}
              id="username"
              onChange={handleUsernameInput}
              variant="outlined"
              placeholder='username'
              helperText={usernameError ? usernameErrorTxt : ''}
            />
            <br />
            <div style={{ marginTop: '10px' }} />
            <TextField
              error={pwError}
              id="password"
              onChange={handlePwInput}
              type="password"
              variant="outlined"
              placeholder='password'
              helperText={pwError ? pwErrorTxt : ''}
            />
          </div>
          <br />
          <Button style={{ marginTop: '10px' }} onClick={handleLogin}>
            Login
          </Button>
        </Paper>
      </div >
  );
}

// Redux
const mapStateToProps = (state: IState) => {
  return {
    user: state.user,
    userExpenses:state.userExpenses
  }
}

const mapDispatchToProps = {
  updateUserLoggedIn: updateUserLoggedIn,
  updateUserInfo: updateUserInfo,
  setExpenses: setExpenses,
  setExpenseTypes: setExpenseTypes,
  setThisMonthExpenses: setThisMonthExpenses,
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);

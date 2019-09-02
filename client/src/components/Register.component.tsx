import { Button, Divider, Grid, Paper, TextField } from '@material-ui/core';
import Axios from 'axios';
import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Row } from 'reactstrap';
import '../App.css';
import { IState, IUiState, IUserState } from '../redux';
import { updateUserInfo, updateUserLoggedIn } from '../redux/actions';
import { Redirect } from 'react-router';

interface IRegisterProps {
  history: any;
  user: IUserState;
  ui: IUiState;
  updateUserLoggedIn: (val: boolean) => void;
  updateUserInfo: (payload: any) => void;
}

export function Register(props: IRegisterProps) {
  const [usernameField, setUsernameField] = useState('');
  const [usernameError, setUsernameError] = useState(false);
  const [usernameErrorTxt, setUsernameErrorTxt] = useState('');
  const [pwField, setPwField] = useState('');
  const [pwError, setPwError] = useState(false);
  const [pwErrorTxt, setPwErrorTxt] = useState('');
  const [pwCheckField, setPwCheckField] = useState('');
  const [pwCheckError, setPwCheckError] = useState(false);
  const [pwCheckErrorTxt, setPwCheckErrorTxt] = useState('');
  const [fnameField, setFnameField] = useState('');
  const [fnameError, setFnameError] = useState(false);
  const [fnameErrorTxt, setFnameErrorTxt] = useState('');
  const [lnameField, setLnameField] = useState('');
  const [lnameError, setLnameError] = useState(false);
  const [lnameErrorTxt, setLnameErrorTxt] = useState('');
  const [emailField, setEmailField] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [emailErrorTxt, setEmailErrorTxt] = useState('');

  const handleUsernameInput = (e: any) => {
    setUsernameField(e.target.value);
    setUsernameError(false);
  }
  const handlePwInput = (e: any) => {
    setPwField(e.target.value);
    setPwError(false);
  }
  const handleCheckPwInput = (e: any) => {
    setPwCheckField(e.target.value);
    setPwCheckError(false);
  }
  const handleFnameInput = (e: any) => {
    setFnameField(e.target.value);
    setFnameError(false);
  }
  const handleLnameInput = (e: any) => {
    setLnameField(e.target.value);
    setLnameError(false);
  }
  const handleEmailInput = (e: any) => {
    setEmailField(e.target.value);
    setEmailError(false);
  }
  async function handleRegistration() {
    if (!usernameField) {
      setUsernameError(true);
      setUsernameErrorTxt('PLease Enter A Username');
    }
    else if (!pwField) {
      setPwError(true);
      setPwErrorTxt('Please Enter A Password');
    }
    else if (!pwCheckField) {
      setPwCheckError(true);
      setPwCheckErrorTxt('Please Re-enter Password');
    }
    else if (pwField !== pwCheckField) {
      setPwError(true);
      setPwErrorTxt('Passwords Do Not Match');
      setPwCheckError(true);
      setPwCheckErrorTxt('Passwords Do Not Match');
    }
    else if (!fnameField) {
      setFnameError(true);
      setFnameErrorTxt('Please Enter First Name');
    }
    else if (!lnameField) {
      setLnameError(true);
      setLnameErrorTxt('Please Enter Last Name');
    }
    else if (!emailField) {
      setEmailError(true);
      setEmailErrorTxt('Please Enter a valid Email Address');
    }
    else {
      const url = 'http://localhost:8080/register/verifyUser';
      await Axios.post(url, {
        username: usernameField,
        email: emailField
      }).then(payload => {
        if (payload.status === 200) { registerUser(); }
      }
      ).catch(err => {
        if (err.response.status === 400) {
          setUsernameError(true);
          setUsernameErrorTxt('Username Already Exists');
        }
        else if (err.response.status === 403) {
          setEmailError(true);
          setEmailErrorTxt('There is Already an Account with the Email Provided');
        }
        else console.log(err);

      })
    }
  }

  async function registerUser() {
    const url = 'http://localhost:8080/register';
    await Axios.post(url, {
      username: usernameField,
      password: pwField,
      firstname: fnameField,
      lastname: lnameField,
      email: emailField
    }).then(payload => {
      const login = 'http://localhost:8080/login';
      Axios.post(login, {
        username: usernameField,
        password: pwField,
      }).then(payload => {
        props.updateUserInfo(payload.data)
        props.updateUserLoggedIn(true);
        props.history.push('/');
      })
    });
  }

  if (props.user.isLoggedIn) return <Redirect push to="/user" />
  return (
    <div style={{ textAlign: 'center' }}>
      <Grid container>
        <Grid item xs={12}>
          <Paper style={{
            display: 'inline-block',
            padding: props.ui.isMobileView ? '0px' : '50px',
            marginBottom: '20px',
            paddingBottom: '20px',
            width: props.ui.isMobileView ? '95%' : '50vh'
          }}>
            <h1>Create a New Account</h1>
            <br />
            <h3>Account Information</h3>
            <Row className="user-register">
              <TextField
                error={usernameError}
                id="username"
                label='Enter Username'
                onChange={handleUsernameInput}
                variant="outlined"
                placeholder='my-username'
                helperText={usernameError ? usernameErrorTxt : ''}
              />
            </Row>
            <Row className="user-register">
              <TextField
                error={pwError}
                id="password"
                onChange={handlePwInput}
                type="password"
                variant="outlined"
                placeholder='Password'
                label='Enter Password'
                helperText={pwError ? pwErrorTxt : ''}
              />
            </Row>
            <Row className="user-register">
              <TextField
                error={pwCheckError}
                id="passwordCheck"
                onChange={handleCheckPwInput}
                type="password"
                variant="outlined"
                placeholder='Password'
                label='Re-type Password'
                helperText={pwCheckError ? pwCheckErrorTxt : ''}
              />
            </Row>
            <br />
            <Divider />
            <Divider />
            <br />
            <h3>Personal Information</h3>
            <Row className="user-register">
              <TextField id="fName"
                error={fnameError}
                onChange={handleFnameInput}
                variant="outlined"
                placeholder='John'
                label='Enter First Name'
                helperText={fnameError ? fnameErrorTxt : ''}
              />
            </Row>
            <Row className="user-register">
              <TextField id="lName"
                variant="outlined"
                placeholder='Doe'
                label='Enter Last Name'
                error={lnameError}
                onChange={handleLnameInput}
                helperText={lnameError ? lnameErrorTxt : ''}
              />
            </Row>
            <Row className="user-register">
              <TextField id="email"
                variant="outlined"
                placeholder="your_email@email.com"
                label='Enter Email Address'
                error={emailError}
                type="email"
                onChange={handleEmailInput}
                helperText={emailError ? emailErrorTxt : ''}
              />
            </Row>
            <Button style={{ marginTop: '10px' }} onClick={handleRegistration}>
              Register
          </Button>
          </Paper>
        </Grid>
      </Grid>

    </div>
  );
}

const mapStateToProps = (state: IState) => {
  return {
    user: state.user,
    ui: state.ui
  }
}

const mapDispatchToProps = {
  updateUserLoggedIn: updateUserLoggedIn,
  updateUserInfo: updateUserInfo
}

export default connect(mapStateToProps, mapDispatchToProps)(Register);

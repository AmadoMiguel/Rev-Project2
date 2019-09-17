import { Button, Checkbox, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, FormControlLabel, FormGroup, FormLabel, Grid, InputAdornment, Paper, Snackbar, TextField } from '@material-ui/core';
import { Edit, Undo } from '@material-ui/icons';
import Axios from 'axios';
import React, { useState } from 'react';
import { connect } from 'react-redux';
import '../App.css';
import { IState, IUserState, IUiState } from '../redux';
import { updateUserInfo } from '../redux/actions/user.actions';
import ChangePw from './ChangePWDialog';
import MySnackbarContentWrapper from './SnackBarComponent';
import { User } from '../models/User';
import { updateUserLoggedIn } from '../redux/actions';

interface IUserAcct {
  user: IUserState;
  ui: IUiState;
  updateUserInfo: (userInfo: User) => void;
  updateUserLoggedIn: (val: boolean) => void;
}

export function User(props: IUserAcct) {
  const [fnameField, setFnameField] = useState('');
  const [lnameField, setLnameField] = useState('');
  const [username, setUsername] = useState('');
  const [emailField, setEmailField] = useState('');
  const [updateFname, setUpdateFname] = useState(false);
  const [updateLname, setUpdateLname] = useState(false);
  const [updateUsername, setUpdateUsername] = useState(false);
  const [updateEmail, setUpdateEmail] = useState(false);
  const [wasEdited, setWasEdited] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [openUp, setOpenUp] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  function handleOpen() {
    setOpen(true);
  }
  function handleClose() {
    setOpen(false);
    handleDeselectAll();
  }
  function handleFollowThru() {
    setOpen(false);
    handleDelete();
    handleDeselectAll();

  }
  function closeUp() {
    setOpenUp(false);
  }
  function closeDelete() {
    setOpenDelete(false);
  }

  const [toDelete, setToDelete] = useState({
    selectAll: false,
    income: false,
    expenses: false,
    budget: false
  });

  const handleSelectAll = (e: any) => {
    setToDelete({
      selectAll: e,
      income: e,
      expenses: e,
      budget: e
    });
  }

  const handleDeselectAll = () => {
    setToDelete({
      selectAll: false,
      income: false,
      expenses: false,
      budget: false
    });
  }
  const editFname = () => {
    setUpdateFname(true);
  }
  const editLname = () => {
    setUpdateLname(true);
  }
  const editUn = () => {
    setUpdateUsername(true);
  }
  const editEmail = () => {
    setUpdateEmail(true);
  }
  const noEditFname = () => {
    setUpdateFname(false);
    if (updateLname || updateUsername || updateEmail)
      console.log('returning true');
    else setWasEdited(false);
  }
  const noEditLname = () => {
    setUpdateLname(false);
    if (updateFname || updateUsername || updateEmail)
      console.log('returning true');
    else setWasEdited(false);

  }
  const noEditUn = () => {
    setUpdateUsername(false);
    if (updateFname || updateLname || updateEmail)
      console.log('returning true');
    else setWasEdited(false);

  }
  const noEditEmail = () => {
    setUpdateEmail(false);
    if (updateFname || updateLname || updateUsername)
      console.log('returning true');
    else setWasEdited(false);
  }
  const handleUsernameInput = (e: any) => {
    setUsername(e.target.value);
    setWasEdited(true);
  }
  const handleFnameInput = (e: any) => {
    setFnameField(e.target.value);
    setWasEdited(true);
  }
  const handleLnameInput = (e: any) => {
    setLnameField(e.target.value);
    setWasEdited(true);
  }
  const handleEmailInput = (e: any) => {
    setEmailField(e.target.value);
    setWasEdited(true);
  }
  function handleCancel() {
    setUpdateEmail(false);
    setUpdateFname(false);
    setUpdateLname(false);
    setUpdateUsername(false);
    setWasEdited(false);
  }
  async function updateUser(body: any) {
    const url = 'http://localhost:8765/user-service/update';
    await Axios.patch(url, body, { headers: { Authorization: props.user.userInfo.token } }).then(payload => {
      props.updateUserLoggedIn(true);
      props.updateUserInfo({
        id: props.user.userInfo.id,
        firstName: updateFname ? fnameField : props.user.userInfo.firstName,
        lastName: updateLname ? lnameField : props.user.userInfo.lastName,
        email: updateEmail ? emailField : props.user.userInfo.email,
        username: updateUsername ? username : props.user.userInfo.username,
        token: props.user.userInfo.token
      });
      handleCancel();
      setOpenUp(true);
    }).catch(err => {
      console.log(err.response.status);
    })
  }
  const handleUpdate = () => {
    let body: string = `{"id": ${props.user.userInfo.id}`;

    if (updateFname && fnameField) {
      body += `, "firstname": "${fnameField}"`;
    }
    else
      setUpdateFname(false);
    if (updateLname && lnameField)
      body += `, "lastname": "${lnameField}"`;
    else
      setUpdateLname(false);
    if (updateUsername && username)
      body += `, "username": "${username}"`;
    else
      setUpdateUsername(false);
    if (updateEmail && emailField)
      body += `, "email": "${emailField}"`;
    else
      setUpdateEmail(false);
    body += `}`;
    let jsonBody = JSON.parse(body);

    updateUser(jsonBody);

  }


  const handleChange = (name: string) => (event: { target: { checked: any; }; }) => {
    if (name === 'selectAll' && !toDelete.selectAll)
      handleSelectAll(event.target.checked);
    else if (name === 'selectAll' && toDelete.selectAll)
      handleDeselectAll();
    else
      setToDelete({ ...toDelete, [name]: event.target.checked });
  };
  async function handleDelete() {

    if (toDelete.budget) {
      const url = `http://localhost:8080/user/budget/${props.user.userInfo.id}`;
      await Axios.delete(url, { headers: { Authorization: props.user.userInfo.token } }).then(payload => {

        setOpenDelete(true);

      })
    }
    if (toDelete.expenses) {
      const url = `http://localhost:8080/expense/user/expense/${props.user.userInfo.id}`;
      await Axios.delete(url, { headers: { Authorization: props.user.userInfo.token } }).then(payload => {
        setOpenDelete(true);
      });

    }
    if (toDelete.income) {
      const url = `http://localhost:8080/user/income/${props.user.userInfo.id}`;
      await Axios.delete(url, { headers: { Authorization: props.user.userInfo.token } }).then(payload => {
        setOpenDelete(true);
      });
    }
  }

  return (

    <Grid container style={{ textAlign: 'center', width: '100%' }}>
      <Grid item xs={12}>
        <Paper style={{
          display: 'inline-block',
          width: props.ui.isMobileView ? '95%' : '500px',
          paddingBottom: '20px'
        }} >
          <h3>Profile Settings</h3>
          {updateFname ?
            <div>
              <TextField
                id="editFirst"
                placeholder={props.user.userInfo.firstName}
                onChange={handleFnameInput}
                label='Edit First Name'
                variant="outlined"
                style={{ width: '200px', margin: '10px' }}
                InputProps={{
                  endAdornment: <InputAdornment position="end" onClick={noEditFname}><Undo /></InputAdornment>,
                }}
              />
            </div>
            :
            <div>
              <TextField
                id="staticFirst"
                value={props.user.userInfo.firstName}
                disabled={true}
                label='First Name'
                variant="filled"
                style={{ width: '200px', margin: '10px' }}
                InputProps={{
                  endAdornment: <InputAdornment position="end" onClick={editFname}><Edit /></InputAdornment>,


                }}

              /></div>}
          {updateLname ?
            <div>
              <TextField
                id="editLast"
                placeholder={props.user.userInfo.lastName}
                onChange={handleLnameInput}
                label='Edit Last Name'
                variant="outlined"
                style={{ width: '200px', margin: '10px' }}
                InputProps={{
                  endAdornment: <InputAdornment position="end" onClick={noEditLname}><Undo /></InputAdornment>,


                }}
              />
            </div> :
            <div>
              <TextField
                id="staticLast"
                value={props.user.userInfo.lastName}
                disabled={true}
                label='Last Name'
                variant="filled"
                style={{ width: '200px', margin: '10px' }}
                InputProps={{
                  endAdornment: <InputAdornment position="end" onClick={editLname}><Edit /></InputAdornment>,


                }}
              />
            </div>}
          {updateUsername ?
            <div>
              <TextField
                id="editUn"
                onChange={handleUsernameInput}
                placeholder={props.user.userInfo.username}
                variant="outlined"
                label='label'
                style={{ width: '200px', margin: '10px' }}
                InputProps={{
                  endAdornment: <InputAdornment position="end" onClick={noEditUn}><Undo /></InputAdornment>,


                }}
              /> </div> :
            <div>
              <TextField
                id="staticUn"
                value={props.user.userInfo.username}
                variant="filled"
                disabled={true}
                label='Username'
                style={{ width: '200px', margin: '10px' }}
                InputProps={{
                  endAdornment: <InputAdornment position="end" onClick={editUn}><Edit /></InputAdornment>,
                }}
              /> </div>}
          {updateEmail ?
            <div>
              <TextField
                id="editEmail"
                onChange={handleEmailInput}
                placeholder={props.user.userInfo.email}
                variant="outlined"
                label='Email'
                style={{ width: '200px', margin: '10px' }}
                InputProps={{
                  endAdornment: <InputAdornment position="end" onClick={noEditEmail}><Undo /></InputAdornment>,
                }}
              /></div> :
            <div>
              <TextField
                id="staticEmail"
                value={props.user.userInfo.email}
                variant="filled"
                disabled={true}
                label='Email'
                style={{ width: '200px', margin: '10px' }}
                InputProps={{
                  endAdornment: <InputAdornment position="end" onClick={editEmail}><Edit /></InputAdornment>,
                }}
              /></div>}
          <ChangePw />
          {wasEdited ?
            <div>
              <Button onClick={handleUpdate} style={{ margin: "5px" }}>Apply Changes</Button>
              <Button onClick={handleCancel} style={{ margin: "5px" }}>Cancel Changes</Button>
            </div> : ''}
          <Snackbar
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            open={openUp}
            autoHideDuration={6000}
            onClose={closeUp}
          >
            <MySnackbarContentWrapper
              variant="success"
              message="User Updated Successfully"
            />
          </Snackbar>

        </Paper>
      </Grid>
      <Grid item xs={12}>

        <Paper style={{
          display: 'inline-block',
          width: props.ui.isMobileView ? '95%' : '500px',
          marginTop: '20px',
          marginBottom: '20px',
          paddingBottom: '20px'
        }}>
          <h3>Data Settings</h3>
          <FormControl>
            <FormLabel style={{ margin: "20px" }}>Select Data to be Deleted</FormLabel>
            <FormGroup>
              {toDelete.selectAll ?
                <FormControlLabel
                  control={
                    <Checkbox checked={toDelete.selectAll} onChange={handleChange('selectAll')} value="deselectAll" />
                  }
                  label='Deselect All' /> :
                <FormControlLabel
                  control={
                    <Checkbox checked={toDelete.selectAll} onChange={handleChange('selectAll')} value="selectAll" />
                  }
                  label='Select All' />}

              <FormControlLabel
                control={
                  <Checkbox checked={toDelete.expenses} onChange={handleChange('expenses')} value="expenses" />
                }
                label='Expenses' />
              <FormControlLabel
                control={
                  <Checkbox checked={toDelete.budget} onChange={handleChange('budget')} value="budget" />
                }
                label='Budget' />
              <FormControlLabel
                control={
                  <Checkbox checked={toDelete.income} onChange={handleChange('income')} value="income" />
                }
                label='Income' />
            </FormGroup>
            {(toDelete.selectAll || toDelete.income || toDelete.expenses || toDelete.budget) ?
              <Button style={{ margin: "20px" }} onClick={handleOpen}>Delete</Button> : ''}
            <div>
              <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
              >
                <DialogTitle id="alert-dialog-title">{"Delete User Data?"}</DialogTitle>
                <DialogContent>
                  <DialogContentText id="alert-dialog-description">
                    Are you sure you want to delete the following data:
            </DialogContentText>
                  {toDelete.budget ? <h5>Budget</h5> : ''}
                  {toDelete.expenses ? <h5>Expenses</h5> : ''}
                  {toDelete.income ? <h5>Income</h5> : ''}
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleClose} color="primary">
                    Cancel
            </Button>
                  <Button onClick={handleFollowThru} color="primary" autoFocus>
                    Delete
            </Button>
                </DialogActions>
              </Dialog>
            </div>
          </FormControl>
          <Snackbar
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            open={openDelete}
            autoHideDuration={6000}
            onClose={closeDelete}
          >
            <MySnackbarContentWrapper
              variant="success"
              message="User Data Deleted Successfully"
            />
          </Snackbar>
        </Paper>
      </Grid>
    </Grid >

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

export default connect(mapStateToProps, mapDispatchToProps)(User);

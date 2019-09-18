import { Backdrop, Button, Divider, Paper, Popover, TextField } from '@material-ui/core';
import React, { Fragment, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { IState, IUserState, IExpensesState, IIncomesState, IBudgetsState } from '../redux';
import { updateUserLoggedIn, updateUserInfo,  } from '../redux/actions/user.actions';
import { setExpenses, setExpenseTypes, setThisMonthExpenses, setThisYearExpensesTotalByMonth } from '../redux/actions/expenses.actions';
import Axios from 'axios';
import { Expense } from '../models/Expense';
import { MonthExpensesTotal } from '../models/MonthExpensesTotal';
import { ExpenseType } from '../models/ExpenseType';
import { setBudgets, setBudgetTypes } from '../redux/actions/budgets.actions';
import { setIncomes, setIncomeTypes } from '../redux/actions/incomes.actions';
import { IncomeType } from '../models/IncomeType';
import { Income } from '../models/Income';
import { BudgetType } from '../models/BudgetType';
import { Budget } from '../models/Budget';
import { User } from '../models/User';
import { PropagateLoader } from 'react-spinners';

interface ILoginProps {
  // Popover info
  handleClose: () => void;
  open: boolean;
  anchorEl: any;
  // User info
  user: IUserState;
  updateUserLoggedIn: (val: boolean) => void;
  updateUserInfo: (userInfo: User) => void;
  // User expenses info
  userExpenses: IExpensesState;
  setExpenses: (expenses:Expense[]) => void;
  setExpenseTypes: (expenseTypes:ExpenseType[]) => void;
  setThisMonthExpenses: (thisMonthExpenses:Expense[]) => void;
  setThisYearExpensesTotalByMonth: (thisYearExpensesTotalByMonth:MonthExpensesTotal[]) => void;
  // User budgets info
  userBudgets: IBudgetsState;
  setBudgets: (budgets:Budget[]) => void;
  setBudgetTypes: (budgetTypes:BudgetType[]) => void;
  // User incomes info
  userIncomes: IIncomesState;
  setIncomes: (incomes:Income[]) => void;
  setIncomeTypes: (incomeTypes:IncomeType[]) => void;
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
  }, [props.open])

  // As soon as user logs in, request expenses information about her/him
  async function getUserExpensesInfo(userId:number) {
    // User expenses info connected to redux
    let url = `http://localhost:8765/expense-service/expense/user/${userId}`;
    await Axios.get(url)
      .then((payload: any) => {
        payload.data ? props.setExpenses(payload.data) : props.setExpenses([]);
      }).catch((err: any) => {
        // Handle error by displaying something else
      });
    
    url = `http://localhost:8765/expense-service/expense/user/${userId}/monthly`;
    await Axios.get(url)
      .then((payload: any) => {
        payload.data ? props.setThisMonthExpenses(payload.data) : props.setThisMonthExpenses([]);
      }).catch((err: any) => {
        // Handle error by displaying something else
      });

    url = `http://localhost:8765/expense-service/expense/user/${userId}/yearly`;
    await Axios.get(url)
      .then((payload: any) => {
        payload.data ? props.setThisYearExpensesTotalByMonth(payload.data) 
        : props.setThisYearExpensesTotalByMonth([]);
      }).catch((err:any) => {
        // Handle error here
      })

    url = `http://localhost:8765/expense-service/expense/types`;
    await Axios.get(url)
      .then((payload: any) => {
        payload.data ? props.setExpenseTypes(payload.data) : props.setExpenseTypes([]);
      }).catch((err: any) => {
        // Handle error by displaying something else
      });
  }

  async function getUserBudgetsInfo(userId:number) {
    // Get user budgets
    let url = `http://localhost:8765/budget-service/budget/user/${userId}`;
    await Axios.get(url)
      .then((payload:any) => {
        payload.data ? props.setBudgets(payload.data) : props.setBudgets([]);
      })
      .catch((err:any) => {
        // Handle error here
      });
    url = `http://localhost:8765/budget-service/budget/types`;
    await Axios.get(url)
      .then((payload:any) => {
        payload.data ? props.setBudgetTypes(payload.data) : props.setBudgetTypes([]);
      })
      .catch((err:any) => {
        // Handle error here
      });
  }

  async function getUserIncomesInfo(userId:number) {
    // Get user incomes
    let url = `http://localhost:8765/income-service/income/user/${userId}`;
    await Axios.get(url)
      .then((payload:any) => {
        props.setIncomes(payload.data);
      })
      .catch((err:any) => {
        // Handle error here
      });
    url = `http://localhost:8765/income-service/income/types`;
    await Axios.get(url)
      .then((payload:any) => {
        props.setIncomeTypes(payload.data);
      });
  }

  async function logIn() {
    const url = 'http://localhost:8765/user-service/login';
    await Axios.post(url, {
      username: usernameField,
      password: pwField,
    }).then(async (payload:any) =>  {
      setPwError(false);
      setUsernameError(false);
      props.updateUserInfo(payload.data)
      // Call the function to retrieve all user expenses information
      await getUserExpensesInfo(payload.data.id);
      // Get user budgets information
      await getUserBudgetsInfo(payload.data.id);
      // Get user incomes information
      await getUserIncomesInfo(payload.data.id);
    }).catch(err => {
      setUsernameError(true);
      setUsernameErrorTxt('');
      setPwError(true);
      setPwErrorTxt('Incorrect Username or Password!');
    });
    // After all information is stored, head user to the overview page
    props.userIncomes.incomeTypes.length > 1 && props.updateUserLoggedIn(true);
    props.handleClose();    
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
    <Fragment>
      <Backdrop open={props.open} />
      <Popover
        style={{
          marginTop: '16px',
        }}
        id={props.open ? 'simple-popover' : undefined}
        open={props.open}
        anchorEl={props.anchorEl}
        onClose={props.handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <div>
          <Paper style={{ display: 'inline-block', padding: '50px' }}>
            <h2>Welcome</h2>
            <div onKeyPress={(e: any) => {
              if (e.key == 'Enter') {
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
        </div>
      </Popover >
    </Fragment>
  )
}

// Redux
// Needed state
const mapStateToProps = (state: IState) => {
  return {
    user: state.user,
    userExpenses:state.userExpenses,
    userBudgets:state.userBudgets,
    userIncomes:state.userIncomes
  }
}

// Needed actions
const mapDispatchToProps = {
  updateUserLoggedIn: updateUserLoggedIn,
  updateUserInfo: updateUserInfo,
  setExpenses: setExpenses,
  setExpenseTypes: setExpenseTypes,
  setThisMonthExpenses: setThisMonthExpenses,
  setThisYearExpensesTotalByMonth: setThisYearExpensesTotalByMonth,
  setBudgets: setBudgets,
  setBudgetTypes: setBudgetTypes,
  setIncomes: setIncomes,
  setIncomeTypes: setIncomeTypes
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
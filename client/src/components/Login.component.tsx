import React, { useState, useEffect } from 'react';
import { Paper, Button, Divider, TextField } from '@material-ui/core';
import { IUserState, IState, IExpensesState, IBudgetsState, IIncomesState } from '../redux';
import { updateUserLoggedIn, updateUserInfo } from '../redux/actions/user.actions';
import { setExpenses, setExpenseTypes, setThisMonthExpenses, 
        setThisYearExpensesTotalByMonth } from '../redux/actions/expenses.actions';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';
import Axios from 'axios';
import { Expense } from '../models/Expense';
import { ExpenseType } from '../models/ExpenseType';
import { MonthExpensesTotal } from '../models/MonthExpensesTotal';
import { Budget } from '../models/Budget';
import { BudgetType } from '../models/BudgetType';
import { User } from '../models/User';
import { Income } from '../models/Income';
import { IncomeType } from '../models/IncomeType';
import { setBudgets, setBudgetTypes } from '../redux/actions/budgets.actions';
import { setIncomeTypes, setIncomes } from '../redux/actions/incomes.actions';

interface ILoginProps {
  // User info
  user: IUserState;
  updateUserInfo: (userInfo: User) => void;
  updateUserLoggedIn: (val: boolean) => void;
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
    let url = `http://localhost:8765/expense-service/expense/user/${userId}`;
    await Axios.get(url)
      .then((payload: any) => {
        props.setExpenses(payload.data);
      }).catch((err: any) => {
        // Handle error by displaying something else
      });
    url = `http://localhost:8765/expense-service/expense/user/${userId}/monthly`;
    await Axios.get(url)
      .then((payload: any) => {
        props.setThisMonthExpenses(payload.data);
      }).catch((err: any) => {
        // Handle error by displaying something else
      });
    url = `http://localhost:8765/expense-service/expense/user/${userId}/yearly`;
    await Axios.get(url)
      .then((payload: any) => {
        props.setThisYearExpensesTotalByMonth(payload.data);
      }).catch((err:any) => {
        // Handle error here
      })
    url = `http://localhost:8765/expense-service/expense/types`;
    await Axios.get(url)
    .then((payload: any) => {
      props.setExpenseTypes(payload.data);
    }).catch((err: any) => {
      // Handle error by displaying something else
    });
  }

  async function getUserBudgetsInfo(userId:number) {
    // Get user budgets
    let url = `http://localhost:8765/budget-service/budget/user/${userId}`;
    await Axios.get(url)
      .then((payload:any) => {
        props.setBudgets(payload.data); 
      })
      .catch((err:any) => {
        // Handle error here
      });
    url = `http://localhost:8765/budget-service/budget/types`;
    await Axios.get(url)
      .then((payload:any) => {
        props.setBudgetTypes(payload.data);
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
      })
      .catch((payload:any) => {
        // Handle error here
      });
  }

  async function logIn() {
    const url = 'http://localhost:8765/user-service/login';
    await Axios.post(url, {
      username: usernameField,
      password: pwField,
    }).then(async (payload:any) => {
      setPwError(false);
      setUsernameError(false);
      // Populate user information
      props.updateUserInfo(payload.data);
      // Request user expenses info
      await getUserExpensesInfo(payload.data.id);
      // Request user budgets info
      await getUserBudgetsInfo(payload.data.id);
      // Request user incomes info
      await getUserIncomesInfo(payload.data.id);
      props.updateUserLoggedIn(true);
    }).catch(err => {
      setUsernameError(true);
      setUsernameErrorTxt('');
      setPwError(true);
      setPwErrorTxt('Incorrect Username or Password!');
    });
    // After all information is stored, redirect user to the overview page
    props.userIncomes.incomeTypes.length > 1 && 
      props.history.push('/');
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
    userExpenses:state.userExpenses,
    userBudgets:state.userBudgets,
    userIncomes:state.userIncomes
  }
}

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

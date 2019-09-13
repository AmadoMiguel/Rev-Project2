import React from 'react';
import { updateUserLoggedIn, updateUserInfo, setExpenses, setExpenseTypes, setThisMonthExpenses, setExpensesTotal, setThisMonthExpensesTotal } from '../redux/actions';
import { IUserState, IState, IExpensesState } from '../redux';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';
import { MonthExpensesTotal } from '../models/MonthExpensesTotal';
import { setThisYearExpensesTotalByMonth } from '../redux/actions/expenses.actions';
import { User } from '../models/User';
import { Expense } from '../models/Expense';
import { ExpenseType } from '../models/ExpenseType';

interface ILogoutProps {
  user: IUserState;
  userExpenses:IExpensesState;
  updateUserLoggedIn: (val: boolean) => void;
  updateUserInfo: (userInfo: User) => void;
  setExpenses: (expenses: Expense[]) => void;
  setExpenseTypes: (expenseTypes: ExpenseType[]) => void;
  setThisMonthExpenses: (thisMonthExpenses: Expense[]) => void;
  setExpensesTotal: (expensesTotal: number) => void;
  setThisMonthExpensesTotal: (thisMonthExpensesTotal: number) => void;
  setThisYearExpensesTotalByMonth: (thisYearExpensesTotalByMonth:MonthExpensesTotal[]) => void;
}

export function Logout(props: ILogoutProps) {
  props.updateUserLoggedIn(false);
  props.updateUserInfo({
    id: 0,
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    token: ''
  })
  props.setExpenses([]);
  props.setExpenseTypes([]);
  props.setThisMonthExpenses([]);
  props.setThisYearExpensesTotalByMonth([]);
  props.setExpensesTotal(0);
  props.setThisMonthExpensesTotal(0);
  return (
    <Redirect to="/" />
  )
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
  setExpensesTotal: setExpensesTotal,
  setThisMonthExpensesTotal: setThisMonthExpensesTotal,
  setThisYearExpensesTotalByMonth: setThisYearExpensesTotalByMonth
}

export default connect(mapStateToProps, mapDispatchToProps)(Logout);
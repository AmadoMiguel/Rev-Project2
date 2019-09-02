import React from 'react';
import { updateUserLoggedIn, updateUserInfo, setExpenses, setExpenseTypes, setThisMonthExpenses, setExpensesTotal, setThisMonthExpensesTotal } from '../redux/actions';
import { IUserState, IState, IExpensesState } from '../redux';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';

interface ILogoutProps {
  user: IUserState;
  userExpenses:IExpensesState;
  updateUserLoggedIn: (val: boolean) => void;
  updateUserInfo: (payload: any) => void;
  setExpenses: (expenses: any) => void;
  setExpenseTypes: (expenseTypes: any) => void;
  setThisMonthExpenses: (thisMonthExpenses: any) => void;
  setExpensesTotal: (expensesTotal: number) => void;
  setThisMonthExpensesTotal: (thisMonthExpensesTotal: number) => void;
}

export function Logout(props: ILogoutProps) {
  props.updateUserLoggedIn(false);
  props.updateUserInfo({
    id: 0,
    first: '',
    last: '',
    username: '',
    token: ''
  })
  props.setExpenses(undefined);
  props.setExpenseTypes(undefined);
  props.setThisMonthExpenses(undefined);
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
  setThisMonthExpensesTotal: setThisMonthExpensesTotal
}

export default connect(mapStateToProps, mapDispatchToProps)(Logout);
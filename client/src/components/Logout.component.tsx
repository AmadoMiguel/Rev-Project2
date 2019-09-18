import React from 'react';
import { IUserState, IState, IExpensesState, IBudgetsState, IIncomesState } from '../redux';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';
import { MonthExpensesTotal } from '../models/MonthExpensesTotal';
import { User } from '../models/User';
import { Expense } from '../models/Expense';
import { ExpenseType } from '../models/ExpenseType';
import { Budget } from '../models/Budget';
import { BudgetType } from '../models/BudgetType';
import { Income } from '../models/Income';
import { IncomeType } from '../models/IncomeType';
import { updateUserLoggedIn, updateUserInfo } from '../redux/actions/user.actions';
import { setExpenses, setExpenseTypes, setThisMonthExpenses, setExpensesTotal, 
  setThisMonthExpensesTotal, setThisYearExpensesTotalByMonth } from '../redux/actions/expenses.actions';
import { setBudgets, setBudgetTypes } from '../redux/actions/budgets.actions';
import { setIncomes, setIncomeTypes } from '../redux/actions/incomes.actions';

interface ILogoutProps {
  user: IUserState;
  updateUserLoggedIn: (val: boolean) => void;
  updateUserInfo: (userInfo: User) => void;
  userExpenses:IExpensesState;
  setExpenses: (expenses: Expense[]) => void;
  setExpenseTypes: (expenseTypes: ExpenseType[]) => void;
  setThisMonthExpenses: (thisMonthExpenses: Expense[]) => void;
  setExpensesTotal: (expensesTotal: number) => void;
  setThisMonthExpensesTotal: (thisMonthExpensesTotal: number) => void;
  setThisYearExpensesTotalByMonth: (thisYearExpensesTotalByMonth:MonthExpensesTotal[]) => void;
  userBudgets: IBudgetsState;
  setBudgets: (budgets: Budget[]) => void;
  setBudgetTypes: (budgetTypes: BudgetType[]) => void;
  userIncomes: IIncomesState;
  setIncomes: (incomes: Income[]) => void;
  setIncomeTypes: (incomeTypes: IncomeType[]) => void;
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
  props.setBudgets([]);
  props.setBudgetTypes([]);
  props.setIncomes([]);
  props.setIncomeTypes([]);
  return (
    <Redirect to="/" />
  )
}

// Redux
const mapStateToProps = (state: IState) => {
  return {
    user: state.user,
    userExpenses:state.userExpenses,
    userBudgets: state.userBudgets,
    userIncomes: state.userIncomes
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
  setThisYearExpensesTotalByMonth: setThisYearExpensesTotalByMonth,
  setBudgets: setBudgets,
  setBudgetTypes: setBudgetTypes,
  setIncomes: setIncomes,
  setIncomeTypes: setIncomeTypes
}

export default connect(mapStateToProps, mapDispatchToProps)(Logout);
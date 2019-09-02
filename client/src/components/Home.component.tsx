import React, { useState, useEffect } from 'react';
import { Paper, Button, Divider, colors, Badge, Grid } from '@material-ui/core';
import { connect } from 'react-redux';
import { IUserState, IState, IUiState } from '../redux';
import Axios from 'axios';
import { BarLoader } from 'react-spinners';
import MixedLineGraph from './data/MixedLineGraph';
import { Container, Row } from 'reactstrap';


interface IHomeProps {
  user: IUserState;
  ui: IUiState;
}


function Home(props: IHomeProps) {
  const [incomes, setIncomes] = useState();
  const [budgets, setBudgets] = useState();
  const [currentMonthExpenses, setCurrentMonthExpenses] = useState();

  const [isLoading, setIsLoading] = useState(false);

  const [totals, setTotals] = useState({
    monthlyExpense: 0,
    income: 0,
    budget: 0
  })

  useEffect(() => {
    // setIsLoading(true);
    // Load budgets, incomes, expenses
    // fetchAllData();
  }, [])

  useEffect(() => {

    let budgetTotal = 0;
    if (budgets) {
      budgetTotal = budgets.map((i: any) => i.amount).reduce((a: any, b: any) => a + b);
    }

    let expensesTotal = 0;
    if (currentMonthExpenses) {
      expensesTotal = currentMonthExpenses.map((i: any) => i.amount).reduce((a: any, b: any) => a + b);
    }

    let incomeTotal = 0;
    if (incomes) {
      incomeTotal = incomes.map((i: any) => i.amount).reduce((a: any, b: any) => a + b);
    }

    setTotals({
      ...totals,
      monthlyExpense: expensesTotal,
      income: incomeTotal,
      budget: budgetTotal
    })
  }, [currentMonthExpenses, budgets, incomes])

  async function fetchAllData() {
    let url = `http://localhost:8080/expense/user/${props.user.id}`;
    await Axios.get(url)
      .then((payload: any) => {
        setCurrentMonthExpenses(payload.data);
      }).catch((err: any) => {
        // Handle error by displaying something else
      });
    url = `http://localhost:8080/income/user/${props.user.id}`;
    await Axios.get(url)
      .then((payload: any) => {
        // console.log(payload.data);
        setIncomes(payload.data);
      }).catch((err: any) => {
        // Handle error by displaying something else
      });
    url = `http://localhost:8080/budget/user/${props.user.id}`;
    await Axios.get(url)
      .then((payload: any) => {
        if (payload.data.length != 0) {
          setBudgets(payload.data);
        }
      }).catch((err: any) => {
        // Handle error by displaying something else
      });
    setIsLoading(false);
  }

  return (
    // Some warnings if income < budget or expense > budget
    // Line graph of expenses over budget
    // Line graph of income over budget
    <div style={{ textAlign: 'center' }}>
      <Paper style={{ display: 'inline-block', padding: '0px 50px 50px 50px' }}>
        {isLoading ? (
          <div style={{
            margin: props.ui.isMobileView ? '75px' : '150px',
            display: 'inline-block'
          }}>
            <BarLoader width={150} color={'#009688'} loading={isLoading} />
          </div>
        ) : (
            <>
              <h2>Here's how you're stacking up</h2>
              <MixedLineGraph />
            </>
          )}
      </Paper>
    </div >
  )
}

// Redux
const mapStateToProps = (state: IState) => {
  return {
    user: state.user,
    ui: state.ui
  }
}

export default connect(mapStateToProps)(Home);

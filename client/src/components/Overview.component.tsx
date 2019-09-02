import { Button, createStyles, ExpansionPanel, ExpansionPanelDetails, ExpansionPanelSummary, Grid, makeStyles, Paper, Table, TableBody, TableCell, TableHead, TableRow, Theme, Typography, withStyles } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Axios from 'axios';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { BarLoader } from 'react-spinners';
import colors from '../assets/Colors';
import Logo from '../assets/Logo.svg';
import { IState, IUiState, IUserState, IExpensesState } from '../redux';
import LineGraph from './data/LineGraph';
import MixedBarGraph from './data/MixedBarGraph';
import MixedLineGraph from './data/MixedLineGraph';
import { setExpenses, setExpenseTypes, setThisMonthExpenses, setExpensesTotal, setThisMonthExpensesTotal } from '../redux/actions';

interface IHomeProps {
  user: IUserState;
  ui: IUiState;
  userExpenses:IExpensesState;
  setExpenses: (expenses:any) => void;
  setExpenseTypes: (expenseTypes:any) => void;
  setThisMonthExpenses: (thisMonthExpenses:any) => void;
  setExpensesTotal: (expensesTotal:number) => void;
  setThisMonthExpensesTotal: (thisMonthExpensesTotal:number) => void;
}

const useStyles = makeStyles((theme: Theme) => createStyles({
  div_container: {
    opacity: 0.85,
    padding: '40px 100px 20px 100px',
    // borderBottom: `2px solid ${colors.darkGreen}`
  },
  div_container_mobile: {
    width: '100%',
    opacity: 0.85,
    paddingTop: '5px',
    paddingBottom: '20px',
  },
  grid_container: {
    margin: 0,
    width: '100%',
    color: colors.offWhite
  },
  table: {
    width: '70%',
    marginLeft: 'auto',
    marginRight: 'auto',
    color: colors.offWhite
  },
  heading: {
    fontSize: '20px',
    fontWeight: 'bold',
  },
  expansion_panel: {
    backgroundColor: 'rgba(0, 0, 0, 0)',
    color: colors.offWhite
  },
  graph_paper: {
    maxWidth: '100%',
    width: '100%',
    opacity: 0.85,
    display: 'inline-block'
  }
}));

const StyledTableCell = withStyles((theme: Theme) =>
  createStyles({
    head: {
      backgroundColor: colors.teal,
      color: colors.offWhite,
      opacity: 0.85
    },
    body: {
      color: colors.offWhite,
      fontSize: 14,
    },
  }),
)(TableCell);

function Overview(props: IHomeProps) {
  const classes = useStyles();
  const [incomes, setIncomes] = useState();
  const [budgets, setBudgets] = useState();
  const [currentMonthExpenses, setCurrentMonthExpenses] = useState();
  const [expMonths, setExpMonths] = useState(0);
  const [types, setTypes] = useState([]);

  const [underBudgets, setUnderBudgets] = useState();
  const [overBudgets, setOverBudgets] = useState();

  const [expanded, setExpanded] = React.useState<string | false>('panel1');

  const [isLoading, setIsLoading] = useState(false);
  const [totals, setTotals] = useState({
    monthlyExpense: 0,
    income: 0,
    budget: 0,
    yearlyExpense: 0
  })

  const [monthlyExpenses, setMonthlyExpenses] = useState();
  const [months, setMonths] = useState();

  const handleChange = (panel: string) => (event: React.ChangeEvent<{}>, newExpanded: boolean) => {
    setExpanded(newExpanded ? panel : false);
  };

  useEffect(() => {
    
    if (props.user.isLoggedIn) {
      // getAllTypes();
      setIsLoading(true);
      fetchAllData();
    }
    // Load budgets, incomes, expenses

  }, [props.user.isLoggedIn])

  useEffect(() => {

    let budgetTotal = 0;
    if (budgets) {
      budgetTotal = budgets.map((i: any) => i.amount).reduce((a: any, b: any) => a + b);
    }

    let expensesTotal = 0;
    if (props.userExpenses.thisMonthExpenses) {
      expensesTotal = props.userExpenses.thisMonthExpenses.map((i: any) => i.amount).reduce((a: any, b: any) => a + b);
    }

    let incomeTotal = 0;
    if (incomes) {
      incomeTotal = incomes.map((i: any) => i.amount).reduce((a: any, b: any) => a + b);
    }

    let yearlyExp = 0;
    if (monthlyExpenses) {
      yearlyExp = monthlyExpenses.reduce((a: any, b: any) => a + b);
    }

    calcOverages();
    setTotals({
      ...totals,
      monthlyExpense: expensesTotal,
      yearlyExpense: yearlyExp,
      income: incomeTotal,
      budget: budgetTotal
    })
  }, [props.userExpenses.thisMonthExpenses, budgets, incomes, monthlyExpenses])

  
  async function fetchAllData() {
    let url = `http://localhost:8080/income/user/${props.user.id}`;
    await Axios.get(url)
      .then((payload: any) => {
        // console.log(payload.data);
        payload.data.length > 0 && setIncomes(payload.data);
      }).catch((err: any) => {
        // Handle error by displaying something else
      });
    url = `http://localhost:8080/budget/user/${props.user.id}`;
    await Axios.get(url)
      .then((payload: any) => {
        if (payload.data.length != 0) {
          payload.data.length > 0 && setBudgets(payload.data);
        }
      }).catch((err: any) => {
        // Handle error by displaying something else
      });
    url = `http://localhost:8080/expense/user/${props.user.id}/yearly`;
    await Axios.get(url)
      .then((payload: any) => {
        let arrMonth: string[] = [];
        let arrTot: number[] = [];
        if (payload.data.length != 0) {
          for (let i = 0; i < payload.data.length; i++) {
            arrMonth.push(payload.data[i].month);
            arrTot.push(payload.data[i].total);
          }
          //arrTot.reverse();
          //arrMonth.reverse();
          setMonthlyExpenses(arrTot);
          setMonths(arrMonth);
          setExpMonths(payload.data.length);
        }
      }).catch((err: any) => {
        // Handle error by displaying something else
      });
      if (props.userExpenses.expenses && 
        props.userExpenses.thisMonthExpenses && props.userExpenses.expenseTypes){
        calcOverages();
      } 
  }

  function calcOverages() {
    // Budget v expense overages
    const dataArr = new Array(2);
    const labels = createGraphLabels();
    const ex = createExpenseGraphData();
    const bg = createBudgetGraphData();
    if (labels && ex) {
      let arr = Array.from(labels, () => 0);
      if (ex) {
        ex.forEach((e: any) => {
          arr[labels.indexOf(e.key)] += e.data;
        });
      }
      dataArr[0] = arr;

      arr = Array.from(labels, () => 0);
      if (bg) {
        bg.forEach((e: any) => {
          arr[labels.indexOf(e.key)] += e.data;
        });
      }
      dataArr[1] = arr;

      const overs = new Array();
      const unders = new Array();
      for (let i = 0; i < dataArr[0].length; i++) {
        if (Number(dataArr[1][i]) < Number(dataArr[0][i])) {
          overs.push({
            category: labels[i],
            difference: dataArr[0][i] - dataArr[1][i]
          });
        } else {
          if (Number(dataArr[1][i]) === 0 && Number(dataArr[0][i]) === 0) continue;
          unders.push({
            category: labels[i],
            difference: dataArr[1][i] - dataArr[0][i]
          })
        }
      }
      setOverBudgets(overs.length > 0 ? overs : undefined);
      setUnderBudgets(unders.length > 0 ? unders : undefined);
    }
    setIsLoading(false);
  }


  function createBudgetGraphData() {
    if (!budgets) return undefined;
    return budgets.map((i: any) => {
      return { key: i.budgetType.type, data: i.amount }
    });
  }

  // User expenses information connected to redux
  function createExpenseGraphData() {
    if (!props.userExpenses.thisMonthExpenses) return undefined;
    return props.userExpenses.thisMonthExpenses.map((i: any) => {
      return { key: i.expenseType.type, data: i.amount }
    });
  }

  function createGraphLabels() {
    if (!props.userExpenses.expenseTypes) return undefined;
    return props.userExpenses.expenseTypes.map((i: any) => {
      return i.type;
    });
  }

  function createLineStaticIncome() {
    let arrIncomes: number[] = [];
    for (let i = 0; i < expMonths; i++) {
      arrIncomes.push(totals.income);
    }
    return arrIncomes;
  }
  function createLineStaticBudget() {
    let arrBudget: number[] = [];
    for (let i = 0; i < expMonths; i++) {
      arrBudget.push(totals.budget);
    }
    return arrBudget;
  }

  return (
    (props.user.isLoggedIn ? (
      (isLoading && (!props.userExpenses.expenseTypes) && (!props.userExpenses.expenses)
       && (!budgets) && (!incomes) && (!months) ? (
        <div style={{ margin: 'auto', height: '100vh', textAlign: 'center' }}>
          <div style={{ marginTop: '40vh', display: 'inline-block' }}>
            <BarLoader width={250} color={colors.offWhite} loading={isLoading} />
          </div>
        </div>
      ) : (
          <div style={{ textAlign: 'center' }}>
            <div className={props.ui.isMobileView ? classes.div_container_mobile : classes.div_container} >
              <ExpansionPanel square expanded={expanded === 'panel1'} onChange={handleChange('panel1')}
                className={classes.expansion_panel}>
                <ExpansionPanelSummary
                  expandIcon={<ExpandMoreIcon style={{ color: colors.offWhite }} />}
                  aria-controls="panel1a-content"
                  id="panel1a-header">
                  <Typography className={classes.heading}>Your Monthly Spending</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                  <Grid className={classes.grid_container} container>
                    <Grid
                      style={{
                        margin: 0
                      }}
                      item xs={props.ui.isMobileView ? 12 : 6}>
                      <Paper className={classes.graph_paper}>
                        <div style={{ display: 'inline-block', textAlign: 'center' }}>
                          <i style={{ color: 'grey', fontSize: '14px' }}>Red bars indicate an over-budget category.</i> <br />
                        </div>
                        <MixedLineGraph isMobileView={props.ui.isMobileView} budgetData={createBudgetGraphData()}
                          expenseData={createExpenseGraphData()} 
                          labels={createGraphLabels()} />
                      </Paper>
                    </Grid>
                    <Grid
                      style={{
                        textAlign: 'center'
                      }}
                      item xs={props.ui.isMobileView ? 12 : 6}>
                      <h2 style={{ marginTop: props.ui.isMobileView ? undefined : '0px' }}>
                        Here's how you're stacking up.
                        </h2>
                      {!currentMonthExpenses && (
                        <>
                          <h4>Start adding expenses to see a detailed review.</h4>
                          <Button size={props.ui.isMobileView ? 'small' : undefined}
                            style={{
                              marginBottom: '5px',
                              width: '10px', maxWidth: '10px',
                              fontSize: '10px', color: colors.offWhite,
                              borderColor: colors.offWhite
                            }}
                            variant='outlined'
                            component={Link} to='/expenses'>
                            Expenses
                          </Button>
                        </>
                      )}
                      {underBudgets && (
                        <>
                          <h3>You met your goals in these categories.<br /> Nice job!</h3>
                          <div style={{ width: '100%' }}>
                            <Table className={classes.table}
                              size={props.ui.isMobileView ? 'small' : 'medium'}>
                              <TableHead>
                                <TableRow>
                                  <StyledTableCell>Category</StyledTableCell>
                                  <StyledTableCell align="right">Remaining Budget ($)</StyledTableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {underBudgets.map((item: any, i: number) => (
                                  <TableRow key={i}>
                                    <StyledTableCell>
                                      {item.category}
                                    </StyledTableCell>
                                    <StyledTableCell align="right">
                                      {item.difference}
                                    </StyledTableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        </>
                      )}
                      {overBudgets && (
                        <>
                          <h3>Some of your spending needs <span style={{ color: colors.orange }}>attention</span>.</h3>
                          {`Go to your  `}
                          <Button size={props.ui.isMobileView ? 'small' : undefined}
                            style={{
                              marginBottom: '5px',
                              width: '10px', maxWidth: '10px',
                              fontSize: '10px', color: colors.offWhite,
                              borderColor: colors.offWhite
                            }}
                            variant='outlined'
                            component={Link} to='/expenses'>
                            Expenses
                          </Button>
                          {`  for a detailed view.`}
                          <div style={{ width: '100%' }}>
                            <Table className={classes.table}
                              size={props.ui.isMobileView ? 'small' : 'medium'}>
                              <TableHead>
                                <TableRow>
                                  <StyledTableCell>Category</StyledTableCell>
                                  <StyledTableCell align="right">Over Budget ($)</StyledTableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {overBudgets.map((item: any, i: number) => (
                                  <TableRow key={i}>
                                    <StyledTableCell>
                                      {item.category}
                                    </StyledTableCell>
                                    <StyledTableCell align="right">
                                      {item.difference}
                                    </StyledTableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        </>
                      )}
                    </Grid>
                  </Grid>
                </ExpansionPanelDetails>
              </ExpansionPanel>
              <ExpansionPanel square expanded={expanded === 'panel2'} onChange={handleChange('panel2')}
                className={classes.expansion_panel}>
                <ExpansionPanelSummary
                  expandIcon={<ExpandMoreIcon style={{ color: colors.offWhite }} />}
                  aria-controls="panel1a-content"
                  id="panel1a-header">
                  <Typography className={classes.heading}>Your Monthly Totals</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                  <Grid container className={classes.grid_container}>
                    <Grid
                      style={{
                        marginTop: props.ui.isMobileView ? '10px' : undefined
                      }}
                      item xs={props.ui.isMobileView ? 12 : 6}>
                      <Paper className={classes.graph_paper}>
                        <MixedBarGraph isMobileView={props.ui.isMobileView} budgets={budgets}
                          expenses={props.userExpenses.thisMonthExpenses} incomes={incomes} 
                          labels={createGraphLabels()} />
                      </Paper>
                    </Grid>
                    <Grid
                      style={{
                        margin: 0
                      }}
                      item xs={props.ui.isMobileView ? 12 : 6}>
                      {totals.income >= totals.budget && totals.monthlyExpense <= totals.budget && totals.income !== 0 ? (
                        <>
                          <h2>The math adds up.</h2>
                          <h3>You did a good job of choosing a practical budget that fits your income and keeps expenses low.</h3>
                        </>
                      ) : (
                          <>
                            {totals.income !== 0 && (<>
                              <h2>You may need to rebalance your budget.</h2>
                              {totals.income < totals.budget
                                && (<h4>It looks like your budget is higher than your income.</h4>)}
                              {totals.monthlyExpense > totals.budget
                                && (<h4>You've spent more than your budget accounts for.</h4>)}
                              {`Go to your  `}
                              <Button size={props.ui.isMobileView ? 'small' : undefined}
                                style={{
                                  marginBottom: '5px',
                                  width: '10px', maxWidth: '10px',
                                  fontSize: '10px', color: colors.offWhite,
                                  borderColor: colors.offWhite
                                }}
                                variant='outlined'
                                component={Link} to='/budget'>
                                Budget
                            </Button>
                              {`  for a detailed view.`}
                            </>)}
                          </>
                        )}
                      <div style={{ width: '100%' }}>
                        <Table className={classes.table}
                          size={props.ui.isMobileView ? 'small' : 'medium'}>
                          <TableHead>
                            <TableRow>
                              <StyledTableCell>Type</StyledTableCell>
                              <StyledTableCell align="right">Total ($)</StyledTableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            <TableRow key={0}>
                              <StyledTableCell>
                                Income
                                </StyledTableCell>
                              <StyledTableCell align="right">
                                {totals.income}
                              </StyledTableCell>
                            </TableRow>
                            <TableRow key={1}>
                              <StyledTableCell>
                                Expense
                                </StyledTableCell>
                              <StyledTableCell align="right">
                                {totals.monthlyExpense}
                              </StyledTableCell>
                            </TableRow>
                            <TableRow key={2}>
                              <StyledTableCell>
                                Budget
                                </StyledTableCell>
                              <StyledTableCell align="right">
                                {totals.budget}
                              </StyledTableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </div>
                    </Grid>
                  </Grid>
                </ExpansionPanelDetails>
              </ExpansionPanel>
              <ExpansionPanel square expanded={expanded === 'panel3'} onChange={handleChange('panel3')}
                className={classes.expansion_panel}>
                <ExpansionPanelSummary
                  expandIcon={<ExpandMoreIcon style={{ color: colors.offWhite }} />}
                  aria-controls="panel1a-content"
                  id="panel1a-header">
                  <Typography className={classes.heading}>Year in Review</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                  <Grid className={classes.grid_container} container>
                    <Grid style={{
                      margin: 0
                    }}
                      item xs={props.ui.isMobileView ? 12 : 6}>
                      {/* <Paper className={classes.graph_paper}>
                        <LineGraph data={0} months={months}
                          expenseTotals={monthlyExpenses}
                          income={createLineStaticIncome()} budget={createLineStaticBudget()} />
                      </Paper> */}
                    </Grid>
                    <Grid
                      style={{
                        margin: 0
                      }}
                      item xs={props.ui.isMobileView ? 12 : 6}>
                      {totals.income * 12 >= totals.budget * 12 && totals.yearlyExpense <= totals.budget * 12 && totals.income !== 0 ? (
                        <>
                          <h2>You had a good year.</h2>
                          <h3>All your expenses have been balanced against your budget with income to spare. Good job!</h3>
                        </>
                      ) : (
                          <>
                            {totals.income !== 0 && (
                              <>
                                <h2>It looks like you may be in debt.</h2>
                                {totals.income < totals.budget
                                  && (<h4>You're yearly budget was over your income.<br />This can give a false sense of security.</h4>)}
                                {totals.monthlyExpense > totals.budget
                                  && (<h4>You didn't meet your budget this year, but there's always the next.</h4>)}
                                {`Go to your  `}
                                <Button size={props.ui.isMobileView ? 'small' : undefined}
                                  style={{
                                    marginBottom: '5px',
                                    width: '10px', maxWidth: '10px',
                                    fontSize: '10px', color: colors.offWhite,
                                    borderColor: colors.offWhite
                                  }}
                                  variant='outlined'
                                  component={Link} to='/budget'>
                                  Budget
                              </Button>
                                {`  for a detailed view.`}
                              </>)}
                          </>
                        )}
                      <div style={{ width: '100%' }}>
                        <Table className={classes.table}
                          size={props.ui.isMobileView ? 'small' : 'medium'}>
                          <TableHead>
                            <TableRow>
                              <StyledTableCell>Type</StyledTableCell>
                              <StyledTableCell align="right">Total ($)</StyledTableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            <TableRow key={0}>
                              <StyledTableCell>
                                Income
                                </StyledTableCell>
                              <StyledTableCell align="right">
                                {totals.income * 12}
                              </StyledTableCell>
                            </TableRow>
                            <TableRow key={1}>
                              <StyledTableCell>
                                Expense
                                </StyledTableCell>
                              <StyledTableCell align="right">
                                {totals.yearlyExpense}
                              </StyledTableCell>
                            </TableRow>
                            <TableRow key={2}>
                              <StyledTableCell>
                                Budget
                                </StyledTableCell>
                              <StyledTableCell align="right">
                                {totals.budget * 12}
                              </StyledTableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </div>
                    </Grid>
                  </Grid>
                </ExpansionPanelDetails>
              </ExpansionPanel>
            </div >
          </div >
        ))
    ) : (
        <div style={{ color: colors.offWhite, textAlign: 'center' }}>
          <img alt='' width='90px' height='90px' src={Logo} />
          <h1> Welcome to Budgy. <br />To get started,</h1>
          <Button style={{ marginTop: '30px', border: `1px solid ${colors.offWhite}`, color: colors.offWhite }}
            variant='text' component={Link} to='/login'>
            Login
          </Button>
          <br />
          <Button component={Link} to='/register' style={{ marginTop: '20px', backgroundColor: colors.orange }}>
            Register
          </Button>
        </div>
      )
    )
  )
}

// Redux
const mapStateToProps = (state: IState) => {
  return {
    user: state.user,
    ui: state.ui,
    userExpenses:state.userExpenses
  }
}

const mapDispatchToProps = {
  setExpenses: setExpenses,
  setExpenseTypes: setExpenseTypes,
  setThisMonthExpenses: setThisMonthExpenses,
  setExpensesTotal: setExpensesTotal,
  setThisMonthExpensesTotal: setThisMonthExpensesTotal
}
export default connect(mapStateToProps,mapDispatchToProps)(Overview);

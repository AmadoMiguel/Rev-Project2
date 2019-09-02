import { Button, Checkbox, FormControlLabel, Paper, Snackbar } from '@material-ui/core';
import Axios from 'axios';
import React, { Fragment, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { BarLoader } from 'react-spinners';
import { Col, Container, Row } from 'reactstrap';
import colors from '../assets/Colors';
import { IState, IUiState, IUserState, IExpensesState } from '../redux';
import DonutGraph from './data/DonutGraph';
import { ExpensesTable } from './ExpensesTablesComponent';
import NewExpense from './NewExpenseDialog';
import MySnackbarContentWrapper from './SnackBarComponent';
import { setExpenses, setExpenseTypes, setExpensesTotal, setThisMonthExpenses, setThisMonthExpensesTotal } from '../redux/actions';

export interface IExpenseProps {
  user: IUserState;
  userExpenses:IExpensesState;
  setExpenses: (expenses:any) => void;
  setThisMonthExpenses: (thisMonthExpenses:any) => void;
  setExpensesTotal: (expensesTotal:number) => void;
  setThisMonthExpensesTotal: (thisMonthExpensesTotal:number) => void;
  ui: IUiState;
  type: number;
  date: string;
  description: string;
  amount: number;
  history: any;
}

function Expenses(props: IExpenseProps) {
  const [hasExpenses, setHasExpenses] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [showTable, setShowTable] = useState(false);
  const [showMonthly, setShowMonthly] = useState(false);
  const [expenseType, setExpenseType] = useState();
  const [tableExpenses, setTableExpenses] = useState([]);
  const [snackBar, setSnackBar] = useState({
    openDelete: false,
    openUpdate: false,
    openCreate: false
  });

  useEffect(() => {
    setSnackBar({
      ...snackBar,
      openDelete: false,
      openUpdate: false,
      openCreate: false,
    })
  }, [props.user.isLoggedIn]);

  useEffect(() => {
    // Avoid app crash in case user has no expenses in the database
    try {
      if (props.userExpenses.expenses.length > 1) {
        props.setExpensesTotal(props.userExpenses.expenses.map((num: any) => num.amount).reduce((a: any, b: any) => a + b));
      } else {
        props.setExpensesTotal(props.userExpenses.expenses[0].amount);
      }
    } catch { setHasExpenses(false); }

    try {
      if (props.userExpenses.thisMonthExpenses.length > 1) {
        props.setThisMonthExpensesTotal(props.userExpenses.expenses.map((num: any) => num.amount).reduce((a: any, b: any) => a + b));
      } else {
        props.setThisMonthExpensesTotal(props.userExpenses.thisMonthExpenses[0].amount);
      }
    } catch { }
    setIsLoading(false);
  }, [props.userExpenses.expenses, props.userExpenses.thisMonthExpenses]);


  function handleCloseSnackBar() {
    setSnackBar({
      ...snackBar,
      openDelete: false,
      openUpdate: false,
      openCreate: false
    })
  }

  // Return all expenses
  function createGraphData() {
    return props.userExpenses.expenses.map((i: any) => {
      return { key: i.expenseType.type, data: i.amount }
    });
  }
  // Return the expenses data for the table
  function generalExpensesTableData() {
    const type = props.userExpenses.expenseTypes.find((type: any) => type.type == expenseType);
    return props.userExpenses.expenses.filter((expense: any) =>
          JSON.stringify(expense.expenseType) == JSON.stringify(type));
  }
  // Return the current month expenses data for the table
  function thisMonthExpensesTableData() {
    const type = props.userExpenses.expenseTypes.find((type: any) => type.type == expenseType);
    return props.userExpenses.thisMonthExpenses.filter((expense: any) =>
          JSON.stringify(expense.expenseType) == JSON.stringify(type));
  }
  // Calculate all expenses total
  function calculateExpensesTotal() {
    return props.userExpenses.expenses.map((num: any) => num.amount).reduce((a: any, b: any) => a + b);
  }
  // Calculate all monthly expenses total
  function calculateThisMonthExpensesTotal() {
    return props.userExpenses.thisMonthExpenses.map((num: any) => num.amount).reduce((a: any, b: any) => a + b);
  }
  // Return monthly expenses
  function createMonthlyGraphData() {
    return props.userExpenses.thisMonthExpenses.map((i: any) => {
      return { key: i.expenseType.type, data: i.amount }
    });
  }

  function createGraphLabels() {
    return props.userExpenses.expenseTypes.map((i: any) => {
      return i.type;
    });
  }

  // Function used to display the expenses in the table.
  function handleElementClick(label: string) {
    const type = props.userExpenses.expenseTypes.find((type: any) => type.type == label);
    if (type) {
      // Show the table if a piece of the donut is clicked
      setExpenseType(label);
      setShowTable(true);
    }
  }

  // Handle view for only show monthly expenses
  function viewMonthlyExpenses(state: boolean) {
    // Show only monthly expenses in the donut graph
    setShowMonthly(state);
    // Show only monthly expenses in the tables
    if (showTable) {
      handleElementClick(expenseType);
    }
  }

  //   Request function for new expense here
  async function createNewExpense(newType: any, newDescripion: string, newAmount: number,
    newDate: string) {
      if (!props.userExpenses.expenses) {
        setShowTable(false);
      }
      setIsLoading(true);
      // Prepare request setup
      const url = 'http://localhost:8080/expense';
      const data = {
        userId: props.user.id,
        expenseType: newType,
        date: newDate,
        description: newDescripion,
        amount: newAmount
      };
      await Axios.post(url, data)
        .then((payload) => {
          setSnackBar({
            ...snackBar,
            openDelete: false,
            openUpdate: false,
            openCreate: true,
          })
          // Handle date conversion for the new expense
          const newDateFormatted = new Date(payload.data.date).toISOString().slice(0, 10);
          payload.data.date = newDateFormatted;
          // Update arrays for properly visualize the new expense added
          const expensesCopy = props.userExpenses.expenses ?
                               props.userExpenses.expenses.concat(payload.data) : 
                               [payload.data];
          props.setExpenses(expensesCopy);
          // Add it to the monthly expenses if the month of the new expense is the current month
          const currentMonth = new Date().getMonth();
          const thisMonthExpensesCopy = expensesCopy.filter((e:any)=>(
            new Date(e.date).getMonth() == currentMonth
          ));
          props.setThisMonthExpenses(thisMonthExpensesCopy);
        });
      setIsLoading(false);
  }

  // Request function to delete an existing expense
  async function deleteExpense(expense: any) {
    setIsLoading(true);
    const url = `http://localhost:8080/expense/${expense.id}`;
    await Axios.delete(url, expense)
      .then(() => {
        setSnackBar({
          ...snackBar,
          openDelete: true,
          openUpdate: false,
          openCreate: false,
        })
        // Remove the expense from the graph by filtering the expenses array
        const tempGraph = props.userExpenses.expenses.filter((e: any) => e.id !== expense.id); 
        props.setExpenses(tempGraph.length > 0 ? tempGraph : undefined);
        // Also update this month expenses
        const currentMonth = new Date().getMonth();
        props.setThisMonthExpenses(tempGraph.filter((e:any)=>(new Date(e.date).getMonth()==currentMonth)));
        setIsLoading(false);
      });
  }

  // Request function to update an expense
  async function updateExpense(expense: any) {
    setIsLoading(true);
    expense.amount = Number(expense.amount);
    // Find the id of the updated expense
    function checkId(exp: any) {
      return exp.id === expense.id;
    }
    // Update the expenses and monthly expenses state in general (parent component)
    // Send the request
    const url = `http://localhost:8080/expense`;
    await Axios.put(url, expense)
      .then(async () => {
        setSnackBar({
          ...snackBar,
          openDelete: false,
          openUpdate: true,
          openCreate: false,
        })
        // Update general expenses array
        const updatedExpenseIndex = props.userExpenses.expenses.findIndex(checkId);
        const expensesCopy = props.userExpenses.expenses;
        expensesCopy[updatedExpenseIndex] = expense;
        props.setExpenses(expensesCopy);
        // Now filter the monthly expenses from the general expenses array according to the month
        // Get current month
        const currentMonth = new Date().getMonth();
        const thisMonthExpensesCopy = expensesCopy.filter( (e:any) => new Date(e.date).getMonth() == currentMonth );
        props.setThisMonthExpenses(thisMonthExpensesCopy);
        setIsLoading(false);
      });
  }

  return (
    <div style={{ textAlign: 'center' }}>
      {!props.user.isLoggedIn ?
        (<>
          <div
            style={{
              marginTop: '50px', marginRight: 'auto', marginLeft: 'auto', textAlign: 'center',
              color: colors.offWhite, width: "60%"
            }}>
            <h2 style={{ marginBottom: '40px' }}>
              With <strong>Budgy</strong> you can schedule your expenses by
                  category, specifying amount and description. <br />
              That way you won´t forget them.
                  <br /><br />To get started,
                </h2>
            <Button style={{ border: `1px solid ${colors.offWhite}`, color: colors.offWhite }}
              variant='text' component={Link} to='/login'>
              Login
                  </Button>
            <b style={{ marginLeft: '10px', marginRight: '10px' }}>or</b>
            <Button component={Link} to='/register' style={{ backgroundColor: colors.orange }}>
              Register
                </Button>
          </div>
        </>)
        :
        (
          (!isLoading && !props.userExpenses.expenses && !hasExpenses) ?
            <>
              <div
                style={{
                  marginTop: '50px', marginRight: 'auto', marginLeft: 'auto', textAlign: 'center',
                  color: colors.teal, width: "60%", backgroundColor: colors.unusedGrey
                }}>
                <h2 style={{ marginBottom: '40px' }}>
                  Start setting up your expenses, {props.user.first}. <br /> <br /> <br />
                  What about a new one? <br />
                  <NewExpense
                    types={props.userExpenses.expenseTypes}
                    createExpense={createNewExpense}
                    view={props.ui.isMobileView} />
                </h2>
              </div>
            </>
            :
            <>
              {
                showTable ?
                  <h2 style={{ color: colors.offWhite }}>
                    {showMonthly ? "This month" : "Total"} {expenseType} expenses</h2> :
                  <h2 style={{ color: colors.offWhite }}>Your expenses</h2>
              }
              <Paper
                style={{
                  margin: '5px auto', padding: '10px',
                  backgroundColor: "rgba(220,245,230,0.9)",
                  width: props.ui.isMobileView ? "90%" : showTable ? '80%' : '50%',
                  height: props.ui.isMobileView ? "90%" : '60%'
                }}>
                {/* Show loader if expenses and monthly expenses aren't filled yet */}
                {(isLoading)
                  ?
                  (
                    <div
                      style={{
                        margin: props.ui.isMobileView ? '75px' : '150px',
                        display: 'inline-block'
                      }}>
                      <BarLoader width={150} color={'#009688'} loading={isLoading} />
                    </div>
                  )
                  :
                  <div>
                    {showTable
                      ?
                      (
                        <Fragment>
                          <Container>
                            <Row>
                              <Col>
                                <Button
                                  color="secondary"
                                  onClick={() => setShowTable(false)}
                                  style={{ display: "inline-block", margin: '5px' }}>
                                  Back
                            </Button>
                                {/* If on table perspective, don't show the type selector */}
                                <NewExpense
                                  types={props.userExpenses.expenseTypes}
                                  createExpense={createNewExpense}
                                  view={props.ui.isMobileView}
                                  tableView={showTable}
                                  type={expenseType} />
                              </Col>
                            </Row>
                          </Container>
                          {
                            isLoading
                              ?
                              <div
                                style={{
                                  margin: props.ui.isMobileView ? '75px' : '150px',
                                  display: 'inline-block'
                                }}>
                                <BarLoader width={150} color={'#009688'} loading={isLoading} />
                              </div>
                              :
                              <ExpensesTable expenses={showMonthly?
                                             thisMonthExpensesTableData():
                                             generalExpensesTableData()}
                                view={props.ui.isMobileView}
                                deleteExpense={deleteExpense}
                                updateExpense={updateExpense} />
                          }
                        </Fragment>
                      )
                      :
                      (
                        <Fragment>
                          {props.userExpenses.expenses &&
                            <div>
                              <h3>{showMonthly ? "This month" : "Overall"} expenses:
                        {isLoading ? "..." : showMonthly ? " $" + calculateThisMonthExpensesTotal() : 
                              " $" + calculateExpensesTotal()}</h3>
                              <i style={{ color: 'grey', fontSize: '14px' }}>
                                Click on any section of the graphic to view details.</i>
                              <DonutGraph
                                data={showMonthly ? createMonthlyGraphData() : createGraphData()}
                                labels={createGraphLabels()}
                                important='Emergency'
                                isMobileView={props.ui.isMobileView}
                                handleElementClick={handleElementClick} />
                              <NewExpense
                                types={props.userExpenses.expenseTypes}
                                createExpense={createNewExpense}
                                view={props.ui.isMobileView} />
                              {/* Toggles between view monthly expenses and overall expenses */}
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={showMonthly}
                                    onChange={showMonthly ? () => viewMonthlyExpenses(false) :
                                      () => viewMonthlyExpenses(true)}
                                    value="checkedB"
                                    color="primary"
                                  />
                                }
                                style={{ marginLeft: '5px' }}
                                label="This month"
                              />
                            </div>}
                        </Fragment>
                      )
                    }
                  </div>
                }
                <Snackbar
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                  }}
                  open={snackBar.openDelete}
                  autoHideDuration={5000}
                  onClose={handleCloseSnackBar}
                >
                  <MySnackbarContentWrapper
                    variant="success"
                    message="Expense Deleted Successfully"
                  />
                </Snackbar>
                <Snackbar
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                  }}
                  open={snackBar.openUpdate}
                  autoHideDuration={5000}
                  onClose={handleCloseSnackBar}
                >
                  <MySnackbarContentWrapper
                    variant="success"
                    message="Expense Updated Successfully"
                  />
                </Snackbar>
                <Snackbar
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                  }}
                  open={snackBar.openCreate}
                  autoHideDuration={5000}
                  onClose={handleCloseSnackBar}
                >
                  <MySnackbarContentWrapper
                    variant="success"
                    message="Expense Created Successfully"
                  />
                </Snackbar>
              </Paper>
            </>
        )}
    </div >
  );
}

// Redux connection
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

export default connect(mapStateToProps,mapDispatchToProps)(Expenses);
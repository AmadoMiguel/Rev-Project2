import { Button, Paper, Snackbar } from '@material-ui/core';
import Axios from 'axios';
import React, { Fragment, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { BarLoader } from 'react-spinners';
import { Col, Container, Row } from 'reactstrap';
import colors from '../assets/Colors';
import { IState, IUiState, IUserState, IIncomesState } from '../redux';
import DonutGraph from './data/DonutGraph';
import MySnackbarContentWrapper from './SnackBarComponent';
import { Income } from '../models/Income';
import { IncomeType } from '../models/IncomeType';
import NewIncome from './NewIncomesDialog';
import { IncomesTable } from './IncomeTablesComponent';
import { setIncomes } from '../redux/actions/incomes.actions';

export interface IIncomeProps {
  user: IUserState;
  userIncomes:IIncomesState;
  setIncomes: (incomes:Income[]) => void;
  ui: IUiState;
  history: any;
}

function Expenses(props: IIncomeProps) {
  const [hasIncomes, setHasIncomes] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [showTable, setShowTable] = useState(false);
  const [incomeType, setIncomeType] = useState();
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
  });

  useEffect(() => {
    if ((props.userIncomes.incomes.length == 1 && props.userIncomes.incomes[0].id != 0) || 
    props.userIncomes.incomes.length > 1) {
      setHasIncomes(true);
    } else {
      setHasIncomes(false);
    }
    setIsLoading(false);
  }, [props.userIncomes.incomes]);

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
    return props.userIncomes.incomes.map((i: Income) => {
      return { key: i.incomeType.type, data: i.amount }
    });
  }
  // Return the expenses data for the table
  function incomesTableData() {
    const type = props.userIncomes.incomeTypes.find((incType: IncomeType) => incType.type == incomeType);
    return props.userIncomes.incomes.filter((income: Income) =>
          JSON.stringify(income.incomeType) == JSON.stringify(type));
  }

  function createGraphLabels() {
    return props.userIncomes.incomeTypes.map((i: IncomeType) => {
      return i.type;
    });
  }

  // Function used to display the expenses in the table.
  function handleElementClick(label: string) {
    const type = props.userIncomes.incomeTypes.find((incType: IncomeType) => incType.type == label);
    if (type) {
      // Show the table if a piece of the donut is clicked
      setIncomeType(label);
      setShowTable(true);
    }
  }

  //   Request function for new income here
  async function createNewIncome(newType: IncomeType, newDescripion: string, newAmount: number) {
      setIsLoading(true);
      // Prepare request setup
      const url = 'http://localhost:8765/income-service/income';
      const data = {
        userId: props.user.userInfo.id,
        incomeType: newType,
        description: newDescripion,
        amount: newAmount
      };
      await Axios.post(url, data)
        .then((payload:any) => {
          setSnackBar({
            ...snackBar,
            openDelete: false,
            openUpdate: false,
            openCreate: true,
          });
          // Update arrays for properly visualize the new income added
          if (props.userIncomes.incomes.length == 1 && props.userIncomes.incomes[0].id == 0) {
            props.setIncomes([payload.data]);
          } else {
            props.setIncomes(props.userIncomes.incomes.concat(payload.data));
          }
        });
      setIsLoading(false);
  }

  // Request function to delete an existing income
  async function deleteIncome(income: any) {
    setIsLoading(true);
    const url = `http://localhost:8765/income-service/income/${income.id}`;
    await Axios.delete(url, income)
      .then(() => {
        setSnackBar({
          ...snackBar,
          openDelete: true,
          openUpdate: false,
          openCreate: false,
        })
        // Remove the expense from the graph by filtering the expenses array
        const tempGraph = props.userIncomes.incomes.filter((i: Income) => i.id !== income.id); 
        props.setIncomes(tempGraph.length > 0 ? tempGraph : []);
        setIsLoading(false);
      });
  }

  // Request function to update an income
  async function updateIncome(income: any) {
    setIsLoading(true);
    income.amount = Number(income.amount);
    // Update the expenses and monthly expenses state in general (parent component)
    // Send the request
    const url = `http://localhost:8765/income-service/income`;
    await Axios.put(url, income)
      .then(async () => {
        setSnackBar({
          ...snackBar,
          openDelete: false,
          openUpdate: true,
          openCreate: false,
        })
        // Update general expenses array
        const updatedIncomeIndex = props.userIncomes.incomes.findIndex((i:Income) => 
          i.id === income.id);
        const incomesCopy = props.userIncomes.incomes;
        incomesCopy[updatedIncomeIndex] = income;
        props.setIncomes(incomesCopy);
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
          (!isLoading && !hasIncomes) ?
            <>
              <div
                style={{
                  marginTop: '50px', marginRight: 'auto', marginLeft: 'auto', textAlign: 'center',
                  color: colors.teal, width: "60%", backgroundColor: colors.unusedGrey
                }}>
                <h2 style={{ marginBottom: '40px' }}>
                  Start setting up your expenses, {props.user.userInfo.firstName}. <br /> <br /> <br />
                  What about a new one? <br />
                  <NewIncome
                    types={props.userIncomes.incomeTypes}
                    createIncome={createNewIncome}
                    view={props.ui.isMobileView} />
                </h2>
              </div>
            </>
            :
            <>
              <h2 style={{ color: colors.offWhite }}>Your incomes</h2>
              <Paper
                style={{
                  margin: '5px auto', padding: '10px',
                  backgroundColor: "rgba(220,245,230,0.9)",
                  width: props.ui.isMobileView ? "90%" : showTable ? '80%' : '50%',
                  height: props.ui.isMobileView ? "90%" : '60%'
                }}>
                {/* Show loader if incomes aren't filled yet */}
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
                                <NewIncome
                                  types={props.userIncomes.incomeTypes}
                                  createIncome={createNewIncome}
                                  view={props.ui.isMobileView}
                                  tableView={showTable}
                                  type={incomeType} />
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
                              <IncomesTable 
                                incomes={incomesTableData()}
                                view={props.ui.isMobileView}
                                deleteIncome={deleteIncome}
                                updateIncome={updateIncome} />
                          }
                        </Fragment>
                      )
                      :
                      (
                        <Fragment>
                          {((props.userIncomes.incomes.length == 1 && props.userIncomes.incomes[0].id != 0)
                            || props.userIncomes.incomes.length > 1) &&
                            <div>
                              <h3>Your incomes, {props.user.userInfo.firstName} </h3>
                              <i style={{ color: 'grey', fontSize: '14px' }}>
                                Click on any section of the graphic to view details.</i>
                              <DonutGraph
                                data= {createGraphData()}
                                labels={createGraphLabels()}
                                important='Emergency'
                                isMobileView={props.ui.isMobileView}
                                handleElementClick={handleElementClick} />
                              <NewIncome
                                types={props.userIncomes.incomeTypes}
                                createIncome={createNewIncome}
                                view={props.ui.isMobileView} />
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
                    message="Expense Deleted Successfully" />
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
    userIncomes:state.userIncomes
  }
}

const mapDispatchToProps = {
  setIncomes: setIncomes
}

export default connect(mapStateToProps,mapDispatchToProps)(Expenses);
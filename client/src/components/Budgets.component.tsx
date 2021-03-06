import { AppBar, Box, Button, Divider, Paper, Tab, Tabs, Typography, Snackbar } from '@material-ui/core';
import Axios from 'axios';
import React, { Fragment, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import { BarLoader } from 'react-spinners';
import colors from '../assets/Colors';
import { IState, IUiState, IUserState, IBudgetsState } from '../redux';
import BudgetTable from './BudgetTable';
import DonutGraph from './data/DonutGraph';
import HorizontalBarGraph from './data/HorizontalBarGraph';
import VerticalBarGraph from './data/VerticalBarGraph';
import { CreateBudgetStepper } from './forms/CreateBudgetStepper';
import MySnackbarContentWrapper from './SnackBarComponent';
import { Budget } from '../models/Budget';
import { setBudgets } from '../redux/actions/budgets.actions';


interface HorizontalTabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
}

export interface IBudgetProps {
  user: IUserState;
  ui: IUiState;
  userBudgets: IBudgetsState;
  setBudgets: (budgets:Budget[]) => void;
}

function HorizontalTabPanel(props: HorizontalTabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      <Box p={3}>{children}</Box>
    </Typography>
  );
}

function a11yProps(index: any) {
  return {
    id: `tab-${index}`,
    'aria-controls': `tabpanel-${index}`,
  };
}

export function Budgets(props: IBudgetProps) {
  const [tabIndex, setTabIndex] = React.useState(0);
  const styles = {
    loadingDiv: {
      margin: props.ui.isMobileView ? '75px' : '150px',
      display: 'inline-block'
    }
  }
  const [isCreatingBudget, setIsCreatingBudget] = useState(false);
  const [tableBudgets, setTableBudgets] = useState();
  const [budgetTotal, setBudgetTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [snackBar, setSnackBar] = useState({
    openDelete: false,
    openUpdate: false,
    openCreate: false
  })

  useEffect(() => {
    setSnackBar({
      ...snackBar,
      openDelete: false,
      openUpdate: false,
      openCreate: false,
    })
  })

  useEffect(() => {
    if (props.userBudgets.budgets.length > 1) {
      setBudgetTotal(props.userBudgets.budgets.map(
        (num: any) => num.amount).reduce((a: any, b: any) => a + b));
    }
  }, [props.userBudgets.budgets])

  async function updateBudget(budget: Budget) {
    setIsCreatingBudget(false);
    const url = `http://localhost:8765/budget-service/budget`;
    await Axios.put(url, budget)
      .then((payload: any) => {
        setIsLoading(false);
        setSnackBar({
          ...snackBar,
          openDelete: false,
          openCreate: false,
          openUpdate: true
        });
      }).catch((err: any) => {
        // Handle error by displaying something else
        alert('Something went wrong. Please try again.');
      });
  }

  // Create budget in db
  async function createBudget(data: any) {
    setIsCreatingBudget(false);
    setIsLoading(true);
    const url = `http://localhost:8765/budget-service/budget`;
    await Axios.post(url, data)
      .then((payload: any) => {
        if (props.userBudgets.budgets.length == 1 && props.userBudgets.budgets[0].id == 0) {
          props.setBudgets([payload.data]);
        } else {
          props.setBudgets(props.userBudgets.budgets.concat(payload.data));
        }
        setTableBudgets(!tableBudgets ? [payload.data] : tableBudgets.concat(payload.data));
        setIsLoading(false);
        setSnackBar({
          ...snackBar,
          openDelete: false,
          openCreate: true,
          openUpdate: false
        });
      }).catch((err: any) => {
        // Handle error by displaying something else
        alert('Something went wrong. Please try again.');
      });
  }

  async function deleteBudget(id: number) {
    const url = `http://localhost:8765/budget-service/budget/delete/${id}`;
    Axios.delete(url)
      .then((payload: any) => {
        setSnackBar({
          ...snackBar,
          openDelete: true,
          openCreate: false,
          openUpdate: false
        });
      }).catch((err: any) => {
        // Handle error by displaying something else
        alert('Something went wrong. Please try again.');
      });
  }

  function handlePanelChange(e: any, newValue: number) {
    setTabIndex(newValue);
  }

  function handleCloseSnackBar() {
    setSnackBar({
      ...snackBar,
      openDelete: false,
      openUpdate: false,
      openCreate: false
    })
  }

  function handleDeleteBudget(ids: number[]) {
    setIsLoading(true);

    ids.forEach(async (id: number) => await deleteBudget(id));
    let filtered = props.userBudgets.budgets.filter((budget: any) => !ids.includes(budget.id));
    props.setBudgets(filtered.length === 0 ? [] : filtered);

    filtered = tableBudgets.filter((budget: any) => !ids.includes(budget.id));
    filtered.length === 0 && setTabIndex(0);
    setTableBudgets(filtered.length === 0 ? undefined : filtered);

    setIsLoading(false);
  }

  function handleUpdateBudget(updatedBudget: Budget) {
    setIsLoading(true);
    updateBudget(updatedBudget);

    // Create a copy of the current user budgets
    let budgetsCopy:Budget[] = props.userBudgets.budgets;
    // Find the updated budget index
    let updatedBudgetIndex = props.userBudgets.budgets.findIndex((budget:Budget) => 
      budget.id === updatedBudget.id);
    budgetsCopy[updatedBudgetIndex] = updatedBudget;
    props.setBudgets(budgetsCopy);

    let tempTableBudgets = tableBudgets.map((budget: any) => {
      return budget.id === updatedBudget.id ? updatedBudget : budget;
    })
    setTableBudgets(tempTableBudgets);
  }

  function handleCreateBudget() {
    setIsCreatingBudget(true);
  }

  function handleCancelCreate() {
    setIsCreatingBudget(false);
  }

  function createGraphData() {
    return props.userBudgets.budgets.map((i: any) => {
      return { key: i.budgetType.type, data: i.amount }
    });
  }

  function createGraphLabels() {
    return props.userBudgets.budgetTypes.map((i: any) => {
      return i.type;
    });
  }

  function handleElementClick(label: number) {
    const type = props.userBudgets.budgetTypes.find((type: any) => type.type == label);

    if (type) {
      const matchedBudgets = props.userBudgets.budgets.filter((budget: any) =>
        JSON.stringify(budget.budgetType) == JSON.stringify(type));

      setTableBudgets(matchedBudgets.sort((a: any, b: any) => b.budgetType.type - a.budgetType.type));
      setTabIndex(2);
    }
  }

  return (
    <>
      {!props.user.isLoggedIn ? (
        <div style={{ marginTop: '50px', marginRight: '10px', marginLeft: '10px', 
                      textAlign: 'center', color: colors.offWhite }}>
          <h2 style={{ marginBottom: '40px' }}>
            Budgets allow you to easily set goals for yourself
            <br /> and see how your spending stacks up.
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
      ) : (
          <>
            {((props.userBudgets.budgets.length == 1 && props.userBudgets.budgets[0].id != 0)
                || props.userBudgets.budgets.length > 1)
              &&
              <h2 style={{ textAlign: 'center', color: colors.offWhite }}>Here's your monthly budget</h2>}
              < Paper style={{
                opacity: 0.85,
                width: props.ui.isMobileView ? '90%' : '55%',
                height: props.ui.isMobileView ? '95%' : '60%',
                maxWidth: '90%',
                maxHeight: '95%',
                margin: '10px auto', padding: '20px 10px 20px 10px'
              }}>
              {((props.userBudgets.budgets.length == 1 && props.userBudgets.budgets[0].id == 0)
                || props.userBudgets.budgets.length == 0)  
                ? (
                <div style={{ textAlign: 'center' }}>
                  <b>Budgets allow you to set goals and easily visualize your limits. </b>
                  <br />
                  <br />
                  <Divider />
                  <br />
                  {!isLoading ? (
                    <Fragment>
                      <h2>Creating a budget is quick and simple.<br />To get started,</h2>
                      {isCreatingBudget ? (
                        <CreateBudgetStepper
                          isMobileView={props.ui.isMobileView} userId={props.user.userInfo.id}
                          types={props.userBudgets.budgetTypes} handleSubmit={createBudget} 
                          handleCancel={handleCancelCreate} />
                      ) : (
                          <Button style={{ marginBottom: '10px' }} 
                          onClick={() => setIsCreatingBudget(true)} size="large" color="secondary">
                            Create a Budget
                          </Button>
                        )}
                    </Fragment>
                  ) : (
                      <div style={styles.loadingDiv}>
                        <BarLoader width={150} color={'#009688'} loading={isLoading} />
                      </div>
                    )}
                </div>
              ) : (
                  <Fragment>
                    <div style={{ textAlign: 'center' }}>
                      <AppBar style={{ backgroundColor: colors.lightTeal }} position="static">
                        <Tabs
                          centered={!props.ui.isMobileView}
                          value={tabIndex}
                          onChange={handlePanelChange}
                          variant={props.ui.isMobileView ? "fullWidth" : undefined}
                        >
                          <Tab style={{ color: colors.offWhite }} label="Donut Chart" {...a11yProps(0)} />
                          <Tab style={{ color: colors.offWhite }} label="Bar Chart" {...a11yProps(1)} />
                          <Tab onClick={() => setTableBudgets(props.userBudgets.budgets)} 
                               style={{ color: colors.offWhite }} 
                               label="Table" {...a11yProps(2)} />
                        </Tabs>
                      </AppBar>
                      <HorizontalTabPanel value={tabIndex} index={0}>
                        <Fragment>
                          <h3 style={{ marginTop: '-5px', marginBottom: '-1px' }}>
                            Monthly budget: ${budgetTotal}</h3>
                          <i style={{ color: 'grey', fontSize: '14px' }}>Click a category to amend your budget.</i> <br />
                          <DonutGraph data={createGraphData()} labels={createGraphLabels()} important='Emergency'
                            isMobileView={props.ui.isMobileView}
                            handleElementClick={handleElementClick} />
                        </Fragment>
                      </HorizontalTabPanel>
                      <HorizontalTabPanel value={tabIndex} index={1}>
                        <Fragment>
                          <h3 style={{ marginTop: '-5px', marginBottom: '-1px' }}>
                            Monthly budget: ${budgetTotal}</h3>
                          <i style={{ color: 'grey', fontSize: '14px' }}>Click a category to amend your budget.</i> <br />
                          {props.ui.isMobileView ? (
                            <VerticalBarGraph data={createGraphData()} 
                              labels={createGraphLabels()} important='Emergency'
                              isMobileView={props.ui.isMobileView}
                              handleElementClick={handleElementClick} />
                          ) : (
                              <HorizontalBarGraph data={createGraphData()} 
                                labels={createGraphLabels()} important='Emergency'
                                isMobileView={props.ui.isMobileView}
                                handleElementClick={handleElementClick} />
                            )}
                        </Fragment>
                      </HorizontalTabPanel>
                      <HorizontalTabPanel value={tabIndex} index={2}>
                        <h3 style={{ marginTop: '-5px', marginBottom: '-1px' }}>
                          Monthly budget: ${budgetTotal}</h3>
                        <i style={{ color: 'grey', fontSize: '14px' }}>Select a budget to make changes.</i> <br />
                        <BudgetTable data={tableBudgets} isMobileView={props.ui.isMobileView} 
                                     types={props.userBudgets.budgetTypes}
                                     handleDeleteBudget={handleDeleteBudget}
                                     handleUpdateBudget={handleUpdateBudget} />
                      </HorizontalTabPanel>
                      {isCreatingBudget ? (
                        <CreateBudgetStepper
                          isMobileView={props.ui.isMobileView} userId={props.user.userInfo.id}
                          types={props.userBudgets.budgetTypes} handleSubmit={createBudget} 
                          handleCancel={handleCancelCreate} />
                      ) : (
                          <Fragment>
                            <br /> <b style={{ marginTop: tabIndex === 2 ? '-15px' : '10px' }}>
                              Missing something?</b> <br />
                            <Button
                              style={{ marginTop: '10px' }} size="small" color="secondary"
                              onClick={handleCreateBudget}>
                              Add another budget
                            </Button>
                          </Fragment>
                        )}
                    </div>
                  </Fragment>
                )}
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
                  message="Budget(s) Deleted Successfully"
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
                  message="Budget Updated Successfully"
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
                  message="Budget Created Successfully"
                />
              </Snackbar>
            </Paper>
          </>
        )
      }
    </>
  );
}

const mapStateToProps = (state: IState) => {
  return {
    user: state.user,
    ui: state.ui,
    userBudgets: state.userBudgets
  }
}

const mapDispatchToProps = {
  setBudgets: setBudgets
}

export default connect(mapStateToProps, mapDispatchToProps)(Budgets);

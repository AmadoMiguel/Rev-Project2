import { Button, Paper, Snackbar } from '@material-ui/core';
import Axios from 'axios';
import React, { Fragment, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { IState, IUiState, IUserState } from '../redux';
import DonutGraph from './data/DonutGraph';
import { IncomesTable } from './IncomeTablesComponent';
import NewIncome from './NewIncomesDialog';
import { List, ListItem } from '@material-ui/core';
import MySnackbarContentWrapper from './SnackBarComponent';


export interface IIncomeProps {
  user: IUserState;
  ui: IUiState;
  type: number;
  description: string;
  amount: number;
}


function Incomes(props: IIncomeProps) {
  const [incomes, setIncomes] = useState();
  const [incomeTypes, setIncomeTypes] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [incomesByUserAndType, setIncomeByUserIdAndTypeId] = useState([]);
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

    if (props.user.isLoggedIn) {
      getAllIncomes();
      getAllIncomeTypes();
    }
  }, [props.user.isLoggedIn])


  function handleCloseSnackBar() {
    setSnackBar({
      ...snackBar,
      openDelete: false,
      openUpdate: false,
      openCreate: false
    })
  }

  async function getAllIncomes() {
    const url = `http://localhost:8080/income/user/${props.user.id}`;
    await Axios.get(url)
      .then((payload: any) => {
        // console.log(payload.data);
        setIncomes(payload.data);
      }).catch((err: any) => {
        // Handle error by displaying something else
      });
  }

  async function deleteIncome(income: any) {
    function checkId(inc: any) {
      return inc.id === income.id;
    }
    const url = `http://localhost:8080/income/${income.id}`;
    await Axios.delete(url, income)
      .then(() => {

        setSnackBar({
          ...snackBar,
          openDelete: true,
          openCreate: false,
          openUpdate: false
        })

        getAllIncomes();
        if (showTable) {
          const deletedIncomesIndex = incomes.findIndex(checkId);
          setIncomes(incomes.splice(deletedIncomesIndex, 1));
          //setShowTable(false)
          handleElementClick(income.incomeType.type);
          // console.log(income.incomeTypes.type)
          //console.log(income.incomeType.type)
        }
      })
      .catch((err: any) => {
        //erros
      });

  }

  async function updateIncome(income: any) {
    income.amount = Number(income.amount);
    function checkId(inc: any) {
      return inc.id === income.id;
    }
    const url = `http://localhost:8080/income`
    Axios.put(url, income)
      .then(() => {

        setSnackBar({
          ...snackBar,
          openDelete: false,
          openCreate: false,
          openUpdate: true
        })

        if (showTable) {
          const updatedIncomeIndex = incomes.findIndex(checkId)
          incomes[updatedIncomeIndex] = income;
          setIncomes(incomes);
        }
      })
  }



  async function getAllIncomeTypes() {
    const url = `http://localhost:8080/income/types`;
    await Axios.get(url)
      .then((payload: any) => {
        // console.log(payload.data);
        setIncomeTypes(payload.data);
      }).catch((err: any) => {
        // Handle error by displaying something else
      });
  }

  function createGraphData() {
    return incomes.map((i: any) => {
      return { key: i.incomeType.type, data: i.amount }
    });
  }

  function createGraphLabels() {
    return incomeTypes.map((i: any) => {
      return i.type;
    });
  }

  async function handleElementClick(label: string) {
    const type = incomeTypes.find((type: any) => type.type == label);
    // console.log(type)
    if (type) {
      const matchedIncomes = incomes.filter((income: any) =>
        JSON.stringify(income.incomeType) == JSON.stringify(type))
      // console.log(matchedIncomes);
      setIncomeByUserIdAndTypeId(matchedIncomes);
      setShowTable(true);
    }
  }

  //   Request function for new income here
  async function createNewIncome(newType: any, newDescripion: string, newAmount: number) {
    // Prepare request setup
    const url = 'http://localhost:8080/income';
    const data = {
      userId: props.user.id,
      incomeType: newType,
      description: newDescripion,
      amount: newAmount
    };
    Axios.post(url, data)
      .then(() => {

        setSnackBar({
          ...snackBar,
          openDelete: false,
          openCreate: true,
          openUpdate: false
        })

        const newIncome = {
          id: Math.max.apply(Math, incomes.map(function (inc: any) { return inc.id; })) + 1,
          ...data
        }
        getAllIncomes()
        if (showTable) {
          setIncomes(incomes.push(newIncome))
          handleElementClick(newIncome.incomeType.type)
        }
      })

    /*
    try {
      console.log(response.status);
      getAllIncomes();
    } catch {
      console.log("ERRORS: ", response.data);
    }
    */
  }

  return (
    <div style={{ textAlign: 'center' }}>
      {!props.user.isLoggedIn && <Redirect to="/login" />}
      <Paper style={{
        opacity: .75, margin: '5px auto', padding: '10px', width: props.ui.isMobileView ? "90%" : showTable ? '80%' : '48%',
        height: props.ui.isMobileView ? "90%" : "60%"
      }}>
        {//<Container style={{ textAlign: 'center'}}> 
        }
        <h2>Manage your income, {props.user.first}</h2>

        {//<Grid item xs={12} md={9}>
        }
        <div>
          {showTable ? (
            <Fragment>
              <List style={{ display: "inline-block" }}>
                <ListItem>
                  <NewIncome
                    types={incomeTypes}
                    createIncome={createNewIncome} />
                  <Button
                    style={{ display: "inline-block", marginLeft: "10px" }}
                    color="secondary"
                    onClick={() => setShowTable(false)}>
                    Back
                </Button>
                </ListItem>
              </List>
              <IncomesTable incomes={incomesByUserAndType} deleteIncome={deleteIncome} updateIncome={updateIncome} />
            </Fragment>
          ) : (
              <Fragment>
                {incomes && (
                  <>
                    <i style={{ color: 'grey', fontSize: '14px' }}>
                      Click on any section of the graphic to view details.</i>
                    <DonutGraph data={createGraphData()} labels={createGraphLabels()} important='Emergency'
                      isMobileView={props.ui.isMobileView}
                      handleElementClick={handleElementClick} />
                  </>)}
                < br />
                <NewIncome
                  types={incomeTypes}
                  createIncome={createNewIncome} />
              </Fragment>
            )}
          {//
            // <br />
            // <NewIncome
            //   types={incomeTypes}
            //   createIncome={createNewIncome} />
            // <br />
          }
        </div>
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          open={snackBar.openCreate}
          autoHideDuration={6000}
          onClose={handleCloseSnackBar}
        >
          <MySnackbarContentWrapper
            variant="success"
            message="Income Created"
          />
        </Snackbar>
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          open={snackBar.openDelete}
          autoHideDuration={6000}
          onClose={handleCloseSnackBar}
        >
          <MySnackbarContentWrapper
            variant="success"
            message="Income Deleted"
          />
        </Snackbar>
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          open={snackBar.openUpdate}
          autoHideDuration={6000}
          onClose={handleCloseSnackBar}
        >
          <MySnackbarContentWrapper
            variant="success"
            message="Income Modified"
          />
        </Snackbar>

      </Paper>
    </div>
  );
}


//Redux
const mapStateToProps = (state: IState) => {
  return {
    user: state.user,
    ui: state.ui
  }
}

export default connect(mapStateToProps)(Incomes);

import { Paper } from '@material-ui/core';
import Axios from 'axios';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { BarLoader } from 'react-spinners';
import colors from '../../assets/Colors';
import { IState, IUiState, IUserState, IExpensesState } from '../../redux';
import { MonthExpensesTotal } from '../../models/MonthExpensesTotal';
import { Expense } from '../../models/Expense';
import { setExpenses, setExpensesTotal, setThisMonthExpenses, 
         setThisMonthExpensesTotal, setThisYearExpensesTotalByMonth }
         from '../../redux/actions/expenses.actions';
import { ExpenseType } from '../../models/ExpenseType';
import ExpUserNoLogin from './ExpUserNotLogIn';
import NoExpenses from './NoExpenses';
import TablePerspective from './TablePerspective';
import DonutPerspective from './DonutPerspective';
import Confirmation from './Confirmation';

export interface IExpenseProps {
  user: IUserState;
  userExpenses:IExpensesState;
  setExpenses: (expenses:Expense[]) => void;
  setThisMonthExpenses: (thisMonthExpenses:Expense[]) => void;
  setExpensesTotal: (expensesTotal:number) => void;
  setThisMonthExpensesTotal: (thisMonthExpensesTotal:number) => void;
  setThisYearExpensesTotalByMonth: (thisYearExpensesTotalByMonth:MonthExpensesTotal[]) => void;
  ui: IUiState;
  history: any;
}

export function Expenses(props: IExpenseProps) {
  const [hasExpenses, setHasExpenses] = useState<boolean>(true);
  const [generalGraphData, setGeneralGraphData] = useState<any[]>();
  const [thisMonthGraphData, setThisMonthGraphData] = useState<any[]>();
  const [generalTableExpenses, setGeneralTableExpenses] = useState<Expense[]>();
  const [thisMonthTableExpenses, setThisMonthTableExpenses] = useState<Expense[]>();
  const [expensesLabels, setExpenseLabels] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showTable, setShowTable] = useState<boolean>(false);
  const [showMonthly, setShowMonthly] = useState<boolean>(false);
  const [expenseType, setExpenseType] = useState<string>("");
  const [snackBar, setSnackBar] = useState({
    openDelete: false,
    openUpdate: false,
    openCreate: false
  });

  useEffect(() => {
    setIsLoading(true);
    if (props.userExpenses.expenses.length > 1) {
      // Get total expenses
      props.setExpensesTotal(
        props.userExpenses.expenses
        .map((e: Expense) => Math.round(e.amount)).reduce((a: any, b: any) => a + b));
      // General graph data (amounts by expense types)
      setGeneralGraphData(props.userExpenses.expenses.map((e: Expense) => {
        return { key: e.expenseType.type, data: e.amount }
      }));  
      // General table expenses
      setGeneralTableExpenses(props.userExpenses.expenses.filter((expense: Expense) =>
      expense.expenseType.type == expenseType));
    } else if (props.userExpenses.expenses.length === 1 &&
      props.userExpenses.expenses[0].id !== 0) {
      props.setExpensesTotal(Math.round(props.userExpenses.expenses[0].amount));
      setGeneralGraphData(props.userExpenses.expenses.map((e: Expense) => {
        return { key: e.expenseType.type, data: e.amount }
      }));  
    } else if (props.userExpenses.expenses.length === 0 ||
      props.userExpenses.expenses[0].id === 0)  {
      props.setExpensesTotal(0);
      setHasExpenses(false);
      setGeneralGraphData([]);  
    }

    if (props.userExpenses.thisMonthExpenses.length > 1) {
      props.setThisMonthExpensesTotal(
        props.userExpenses.thisMonthExpenses
        .map((e: Expense) => Math.round(e.amount)).reduce((a: any, b: any) => a + b));
      // This month graph data (amounts by expense types)
      setThisMonthGraphData(props.userExpenses.thisMonthExpenses.map((e: Expense) => {
        return { key: e.expenseType.type, data: e.amount }
      }));  
      // This month table expenses
      setThisMonthTableExpenses(props.userExpenses.thisMonthExpenses.filter((expense: Expense) =>
      expense.expenseType.type == expenseType));
    } else if (props.userExpenses.thisMonthExpenses.length === 1 && 
      props.userExpenses.thisMonthExpenses[0].id !== 0) {
      props.setThisMonthExpensesTotal(Math.round(props.userExpenses.thisMonthExpenses[0].amount));
      setThisMonthGraphData(props.userExpenses.thisMonthExpenses.map((e: Expense) => {
        return { key: e.expenseType.type, data: e.amount }
      }));  
      setThisMonthTableExpenses(props.userExpenses.thisMonthExpenses.filter((expense: Expense) =>
      expense.expenseType.type == expenseType));
    } else if (props.userExpenses.thisMonthExpenses.length === 0) {
      props.setThisMonthExpensesTotal(0);
      setThisMonthGraphData([]);  
      setThisMonthTableExpenses([]);
    }
    // Labels for the donut graph
    if (!expensesLabels.length){
      setExpenseLabels(props.userExpenses.expenseTypes.map((t: ExpenseType) => {
      return t.type}));
    }
    setIsLoading(false);
  }, [props.userExpenses.expenses, props.userExpenses.thisMonthExpenses, expenseType]);


  function handleCloseSnackBar() {
    setSnackBar({
      ...snackBar,
      openDelete: false,
      openUpdate: false,
      openCreate: false
    })
  }

  // Function used to display the expenses in the table.
  function handleElementClick(label: string) {
    const type = props.userExpenses.expenseTypes.find((type: ExpenseType) => type.type === label);
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
  async function createNewExpense(newType: ExpenseType, newDescripion: string, newAmount: number,
    newDate: string) {
      setIsLoading(true);
      // Prepare request setup
      const url = 'http://localhost:8765/expense-service/expense';
      const data = {
        userId: props.user.userInfo.id,
        expenseType: newType,
        date: newDate,
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
          })
          // Handle date conversion for the new expense
          const newDateFormatted = new Date(payload.data.date);
          // Get the year
          payload.data.date = newDateFormatted;
          // Update arrays for properly visualize the new expense added
          if (props.userExpenses.expenses.length === 1 && 
            props.userExpenses.expenses[0].id === 0) {
              const newExpense:Expense = payload.data;
            props.setExpenses([newExpense]);
          } else {
            const newExpense:Expense = payload.data;
            props.setExpenses(props.userExpenses.expenses.concat(newExpense));
          }
          // Add it to the monthly expenses if the month of the new expense is the current month
          const currentMonth = new Date().getMonth();
          if (new Date(payload.data.date).getMonth() == currentMonth) {
            const newExpense:Expense = payload.data;
            props.setThisMonthExpenses(props.userExpenses.thisMonthExpenses.concat(newExpense));
          }
          // Get current date and a year ago date to see if the expense date fits in that time
          const currentDate = new Date();
          const aYearAgoDate = new Date();
          aYearAgoDate.setFullYear(currentDate.getFullYear()-1);
          if ((new Date(payload.data.date) < currentDate) && (new Date(payload.data.date) > aYearAgoDate) ) {
            // Get the month as string
            let months = ["January", "February", "March", "April", "May", "June", "July", "August", 
                          "September", "October", "November", "December" ];
            const monthName = months[new Date(payload.data.date).getMonth()];
            // If the month was already in the yearly totals, add new amount to it
            const indexOfTotalExpenses = props.userExpenses.thisYearTotalExpensesByMonth
            .findIndex((e:MonthExpensesTotal) => e.month === monthName );
            if (indexOfTotalExpenses === -1) {
              // Check if the list of monthly totals by year is empty or barely initialized by redux
              if (props.userExpenses.thisYearTotalExpensesByMonth.length == 1 && 
                props.userExpenses.thisYearTotalExpensesByMonth[0].month == "") {
                  props.setThisYearExpensesTotalByMonth([{month:monthName, total:payload.data.amount}]);
              } else {
                // Concatenate the new month with the corresponding amount to the total of that month
                props.setThisYearExpensesTotalByMonth(
                  props.userExpenses.thisYearTotalExpensesByMonth
                  .concat({month:monthName,total:payload.data.amount}));
              }
            } else {
              // Add the expense amount to the total for that month
              let copyOfMonthlyTotals = props.userExpenses.thisYearTotalExpensesByMonth;
              copyOfMonthlyTotals[indexOfTotalExpenses].total += payload.data.amount;
              props.setThisYearExpensesTotalByMonth(copyOfMonthlyTotals);
            }
          }
          setIsLoading(false);
        });
  }

  // Request function to delete an existing expense
  async function deleteExpense(expense: any) {
    setIsLoading(true);
    const url = `http://localhost:8765/expense-service/expense/${expense.id}`;
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
        props.setExpenses(tempGraph.length > 0 ? tempGraph : []);
        // Also remove the expense from current month expenses in case is there too
        props.setThisMonthExpenses(props.userExpenses.thisMonthExpenses
          .filter((e:Expense) => (e.id !== expense.id)));
        // Update this year monthly total expenses
        // Get current date and a year ago date to see if the expense date fits in that time
        const currentDate = new Date();
        const aYearAgoDate = new Date();
        aYearAgoDate.setFullYear(currentDate.getFullYear()-1);
        // Define year months
        let months = ["January", "February", "March", "April", "May", "June", "July", "August", 
                      "September", "October", "November", "December" ];
        let copyOfMonthlyTotals = props.userExpenses.thisYearTotalExpensesByMonth;
        const indexOfTotalToSubstract = copyOfMonthlyTotals
        .findIndex((t:MonthExpensesTotal) => (t.month == months[new Date(expense.date).getMonth()]));
        // Find the index of the monthly total that holds the value of the recently deleted expense
        if (indexOfTotalToSubstract !== -1) {
          // Remove the monthly total in case by deleting the expense its corresponding total
          // reaches 0 or below
          if (copyOfMonthlyTotals[indexOfTotalToSubstract].total - expense.amount <= 0) {
            copyOfMonthlyTotals.splice(indexOfTotalToSubstract,1);
            // Substract the value of the recently deleted expense from its corresponding monthly total
          } else {
            copyOfMonthlyTotals[indexOfTotalToSubstract].total -= expense.amount;
          }
          props.setThisYearExpensesTotalByMonth(copyOfMonthlyTotals);
        }
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
    const url = `http://localhost:8765/expense-service/expense`;
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
        // Update this year monthly total expenses before updating the expenses
        // Define year months
        let months = ["January", "February", "March", "April", "May", "June", "July", "August", 
                      "September", "October", "November", "December" ];
        // Compare expense before update and after update and check if the month changed, and also
        // check the amount change in order to properly update its corresponding value in the
        // monthly total
        const monthOfCurrentExpense = new Date(expensesCopy[updatedExpenseIndex].date).getMonth();
        const monthNameForCurExp = months[monthOfCurrentExpense];
        const yearOfUpdatedExpense = new Date(expense.date).getFullYear();
        const monthOfUpdatedExpense = new Date(expense.date).getMonth();
        const dayOfUpdatedExpense = new Date(expense.date).getDay();
        const monthNameForUpdExp = months[monthOfUpdatedExpense];
        const amountOfCurrentExpense = expensesCopy[updatedExpenseIndex].amount;
        const amountOfUpdatedExpense = expense.amount;
        const currentMonth:number = new Date().getMonth();
        const currentYear:number = new Date().getFullYear();
        const currentDay:number = new Date().getDay();
        // Create a copy of the monthly totals
        let monthlyTotalsCopy:MonthExpensesTotal[] = props.userExpenses.thisYearTotalExpensesByMonth;
        // First, check if the month wasn't updated
        if (monthOfCurrentExpense==monthOfUpdatedExpense && (yearOfUpdatedExpense === currentYear
          || yearOfUpdatedExpense==currentYear-1 && dayOfUpdatedExpense>=currentDay)) {
          const indexOfTotalForMonth:number = monthlyTotalsCopy
          .findIndex((t:MonthExpensesTotal)=>(t.month == monthNameForCurExp));
          if (amountOfCurrentExpense > amountOfUpdatedExpense) {
            const dif:number = amountOfCurrentExpense - amountOfUpdatedExpense;
            if (monthlyTotalsCopy[indexOfTotalForMonth].total - dif <= 0) {
              monthlyTotalsCopy.splice(indexOfTotalForMonth,1);
              // Substract the value of the recently deleted expense from its corresponding monthly total
            } else {
              monthlyTotalsCopy[indexOfTotalForMonth].total -= dif;
            }
          } else if (amountOfCurrentExpense < amountOfUpdatedExpense) {
            const dif:number = amountOfUpdatedExpense - amountOfCurrentExpense;
            monthlyTotalsCopy[indexOfTotalForMonth].total += dif;
          }
        } else {
          // If the month is different, check if the new selected month is already on the
          // monthly totals array. 
          const indexOfTotalForMonthCur:number = monthlyTotalsCopy
          .findIndex((t:MonthExpensesTotal)=>(t.month === monthNameForCurExp)); 
          const indexOfTotalForMonthUpd:number = monthlyTotalsCopy
          .findIndex((t:MonthExpensesTotal)=>(t.month === monthNameForUpdExp)); 
          // Check the month for which the monthly total has to be updated
          if (indexOfTotalForMonthUpd !== -1 ) {
            if (indexOfTotalForMonthCur !== -1) {
              // Substract the value of the recently deleted expense from its corresponding monthly total
              if (monthlyTotalsCopy[indexOfTotalForMonthCur].total - amountOfCurrentExpense <= 0) {
                monthlyTotalsCopy.splice(indexOfTotalForMonthCur,1);
              } else {
                monthlyTotalsCopy[indexOfTotalForMonthCur].total -= amountOfCurrentExpense;
              }
            }
            // Add the amount of the expense to the monthly total of the corresponding month
            monthlyTotalsCopy[indexOfTotalForMonthUpd] += expense.amount;
          } else {
            if (indexOfTotalForMonthCur !== -1) {
              // Substract the value of the recently deleted expense from its corresponding monthly total
              if (monthlyTotalsCopy[indexOfTotalForMonthCur].total - amountOfCurrentExpense <= 0) {
                monthlyTotalsCopy.splice(indexOfTotalForMonthCur,1);
              } else {
                monthlyTotalsCopy[indexOfTotalForMonthCur].total -= amountOfCurrentExpense;
              }
            }
            // Create a new monthly total for the expense in case the new updated date fits on the
            // previous year date range
            if (yearOfUpdatedExpense === currentYear) {
              if (monthOfUpdatedExpense < currentMonth) {
                monthlyTotalsCopy.push({month:monthNameForUpdExp,total:expense.amount});
              } else if (monthOfUpdatedExpense == currentMonth && dayOfUpdatedExpense<=currentDay) {
                monthlyTotalsCopy.push({month:monthNameForUpdExp,total:expense.amount});
              } 
            } else if (yearOfUpdatedExpense < currentYear) {
              if (monthOfUpdatedExpense >= currentMonth) {
                monthlyTotalsCopy.push({month:monthNameForUpdExp,total:expense.amount});
              }
            }
          }
        }
        // Update general expenses
        expensesCopy[updatedExpenseIndex] = expense;
        props.setExpenses(expensesCopy);
        // Now filter the monthly expenses from the general expenses array according to the month
        // Get current month
        const thisMonthExpensesCopy = expensesCopy
        .filter( (e:Expense) => new Date(e.date).getMonth() == currentMonth );
        props.setThisMonthExpenses(thisMonthExpensesCopy);
        // Update monthly totals
        props.setThisYearExpensesTotalByMonth(monthlyTotalsCopy);
        setIsLoading(false);
      });
  }

  return (
    <div style={{ textAlign: 'center' }}>
      {!props.user.isLoggedIn ?
        (
          // Display screen to encourage user to log in or register
          <ExpUserNoLogin />
        )
        :
        (
          (!isLoading && !hasExpenses) ?
            //  User is logged in and has no expenses 
              <NoExpenses 
              firstName ={props.user.userInfo.firstName}
              types={props.userExpenses.expenseTypes}
              createExpense={createNewExpense}
              view ={props.ui.isMobileView}/>
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
                  <div data-testid = "graphs-container">
                    {showTable
                      ?
                        (
                          // Show expenses information by type in the table
                          <TablePerspective 
                          tableView={showTable}
                          setShowTable={setShowTable}
                          tabExpenses ={showMonthly ? thisMonthTableExpenses:
                          generalTableExpenses}
                          delExpense={deleteExpense}
                          updExpense={updateExpense}
                          types={props.userExpenses.expenseTypes}
                          createExpense={createNewExpense}
                          view={props.ui.isMobileView}
                          type={expenseType}
                          loading={isLoading} />
                        )
                      :
                        (
                          // Donut graph perspective
                          <DonutPerspective 
                          expenses={props.userExpenses.expenses}
                          expTotal={props.userExpenses.expensesTotal}
                          expTypes={props.userExpenses.expenseTypes}
                          monthExpTotal={props.userExpenses.thisMonthExpensesTotal}
                          loading={isLoading}
                          showMonthly={showMonthly}
                          graphData={showMonthly ? thisMonthGraphData : generalGraphData}
                          labels={expensesLabels}
                          view={props.ui.isMobileView}
                          selectedType={handleElementClick}
                          createExpense={createNewExpense}
                          viewMonthlyExpenses={viewMonthlyExpenses}
                          />
                        )
                    }
                  </div>
                }
                {/* Confirmation snackbar variants */}
                <Confirmation 
                open={snackBar.openDelete}
                message={"Expense Deleted Succesfully"}
                close ={handleCloseSnackBar}/>
                
                <Confirmation 
                open={snackBar.openUpdate}
                message={"Expense Updated Succesfully"}
                close ={handleCloseSnackBar}/>
                
                <Confirmation 
                open={snackBar.openCreate}
                message={"Expense Created Succesfully"}
                close ={handleCloseSnackBar}/>
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
  setThisMonthExpenses: setThisMonthExpenses,
  setExpensesTotal: setExpensesTotal,
  setThisMonthExpensesTotal: setThisMonthExpensesTotal,
  setThisYearExpensesTotalByMonth: setThisYearExpensesTotalByMonth
}

export default connect(mapStateToProps,mapDispatchToProps)(Expenses);
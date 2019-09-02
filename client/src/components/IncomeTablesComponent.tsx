import { Button, Container, Dialog, DialogActions, DialogContent, Input } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import { createStyles, makeStyles, Theme, withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import React, { Fragment, useState } from 'react';
import { okPath, okTool, pencilPath, pencilTool, removePath, removeTool, undoPath, undoTool } from '../assets/Icons';
import colors from '../assets/Colors';


const StyledTableCell = withStyles((theme: Theme) =>
  createStyles({
    head: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    body: {
      fontSize: 14,
    },
  }),
)(TableCell);

// const StyledTableRow = withStyles((theme: Theme) =>
//   createStyles({
//     root: {
//       '&:nth-of-type(odd)': {
//         backgroundColor: theme.palette.background.default,
//       },
//     },
//   }),
// )(TableRow);

export function IncomesTable(props: any) {
  const [editRow, setEditRow] = useState(false);
  const [editRowKey, setEditRowKey] = useState(0);
  const [state, setState] = useState();
  const [confirmDialog, setConfirmDialog] = useState(false);

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);


  function handleEditButton(income: any) {
    setState(income);
    setEditRow(true);
  }

  const handleEditedIncomeChange = (e: any) => {
    if (e.target.name == 'amount') {
      e.target.value = Number(e.target.value);
    }
    setState({
      ...state, [e.target.name]: e.target.value
    });
  }

  function handleChangePage(event: unknown, newPage: number) {
    setPage(newPage);
  }

  function handleChangeRowsPerPage(event: React.ChangeEvent<HTMLInputElement>) {
    setRowsPerPage(+event.target.value);
    setPage(0);
  }
  const emptyRows = rowsPerPage - Math.min(rowsPerPage, props.incomes.length - page * rowsPerPage);

  const useStyles = makeStyles((theme: Theme) =>
    createStyles({
      root: {
        marginTop: theme.spacing(1),
        overflowX: 'auto',
        margin: "auto"
      },
      table: {
        width: props.view ? "100%" : "80?",
        textAlign: "center",
        background: "rgba(10,180,140,0.3)"
      },
    }),
  );
  const classes = useStyles(props);
  const columnStyle = { marginRight: '2px' }
  /*
    useEffect(() => {
      createTable();
    }, [])
  
    // This function sends the request to get all user reimbursements
    function createTable() {
      setIncomes(props.incomes);
       //console.log(incomes);
    }
  */

  /*
  // Go back to the incomes component
  function handleBackButton() {
    // props.location.state.props.history.push("/incomes");
    props.changeType(0);
  }
*/

  //need to fix
  /*
  async function handleClickDelete(id: number) {
    const url = `http://localhost:8080/income/${id}`;
    await Axios.delete(url)
        .catch((err: any) => {
            //erros
        });
  }
  */

  return (
    <div>
      <Paper className={classes.root}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <StyledTableCell style={columnStyle} size='small'>Amount</StyledTableCell>
              <StyledTableCell style={columnStyle}>Description</StyledTableCell>
              <StyledTableCell style={columnStyle}></StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {props.incomes.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row: any) => (
              <TableRow key={row.id}>
                <TableCell component="th" scope="row" size='small'>
                  <Input fullWidth={false}
                    disabled={(editRow && (editRowKey === row.id)) ? false : true}
                    style={{
                      fontSize: '13.3px',
                      color: (editRow && (editRowKey === row.id)) ? "black" : "grey"
                    }}
                    type="number"
                    defaultValue={
                      (editRow && (editRowKey === row.id)) ? state.amount : row.amount}
                    name="amount"
                    onChange={(e: any) => handleEditedIncomeChange(e)} />
                </TableCell>
                <TableCell component="th" scope="row">
                  <Input
                    fullWidth={false}
                    disabled={(editRow && (editRowKey === row.id)) ? false : true}
                    style={{
                      fontSize: '13.3px',
                      color: (editRow && (editRowKey === row.id)) ? "black" : "grey"
                    }}
                    multiline={true}
                    defaultValue={
                      (editRow && (editRowKey === row.id)) ? state.description : row.description}
                    name="description"
                    onChange={(e: any) => handleEditedIncomeChange(e)} />
                </TableCell>
                {(editRow && editRowKey === row.id) ?
                  // If row is in edit mode
                  <Fragment>
                    <TableCell>
                      <Button onClick={() => {
                        props.updateIncome(state);
                        setEditRow(false);
                        setEditRowKey(0);
                      }}>
                        <svg fill={colors.offWhite} xmlns={okTool} width="24" height="24" viewBox="0 0 24 24">
                          <path d={okPath} />
                        </svg>
                      </Button>
                      {/* Assign the onClick function to notify the parent which expense
                        will be deleted */}
                      <Button onClick={() => {
                        setEditRow(false);
                        setEditRowKey(0);
                        setState(row);
                      }}>
                        <svg xmlns={undoTool} fill={colors.offWhite}
                          width="24" height="24" viewBox="0 0 24 24">
                          <path d={undoPath} />
                        </svg>
                      </Button>
                    </TableCell>
                  </Fragment>
                  :
                  <Fragment>
                    <TableCell>
                      <Button
                        style={{ margin: "5px" }}
                        onClick={() => { handleEditButton(row); setEditRowKey(row.id); }}>
                        <svg fill={colors.offWhite} xmlns={pencilTool}
                          width="24" height="24" viewBox="0 0 24 24">
                          <path d={pencilPath} />
                        </svg>
                      </Button>
                      {/* Assign the onClick function to notify the parent which
                        income will be deleted */}
                      <Button
                        style={{ backgroundColor: colors.red, marginLeft: "5px" }}
                        onClick={() => {
                          setConfirmDialog(true);
                          setState(row);
                        }}>
                        <svg fill={colors.offWhite} xmlns={removeTool}
                          width="24" height="24" viewBox="0 0 24 24">
                          <path d={removePath} />
                        </svg>
                      </Button>
                      {
                        <Paper style={{ textAlign: "center" }}>
                          <Container>
                            <Dialog open={confirmDialog}>
                              <DialogContent>
                                Are you sure?
                              <br />
                              </DialogContent>
                              <DialogActions>
                                <Button
                                  onClick={() => { props.deleteIncome(row); setConfirmDialog(false) }}
                                  color="primary">
                                  Ok
                                </Button>
                                <Button
                                  onClick={() => setConfirmDialog(false)}
                                  color="secondary">
                                  Cancel
                                </Button>
                              </DialogActions>
                            </Dialog>
                          </Container>
                        </Paper>
                      }
                    </TableCell>
                  </Fragment>
                }
              </TableRow>
            ))}
            {emptyRows > 0 && (
              <TableRow style={{ height: 49 * emptyRows }}>
                <TableCell colSpan={4} />
              </TableRow>
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          colSpan={3}
          component="div"
          count={props.incomes.length}
          rowsPerPage={rowsPerPage}
          page={page}
          SelectProps={{
            inputProps: { 'aria-label': 'rows per page' },
            native: true,
          }}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
}

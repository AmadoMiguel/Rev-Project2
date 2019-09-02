import { Container, Paper, TextField, InputAdornment, IconButton } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import React, { Fragment, useEffect } from 'react';
import { Row } from 'reactstrap';
import AddIcon from '@material-ui/icons/AddCircle';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
  }),
);

export default function NewExpense(props: any) {
  const classes = useStyles(props);
  const [state, setState] = React.useState({
    open: false,
    type: 0,
    description: '',
    amount: 0,
    date: new Date().toISOString().slice(0, 10),
    formFilled: true
  });

  const handleChange = (name: keyof typeof state) => (
    event: React.ChangeEvent<{ value: unknown }>,
  ) => {
    setState({
      ...state,
      [name]: event.target.value
    });
  };

  function handleClickOpen() {
    setState({
      type: 0,
      date: new Date().toISOString().slice(0, 10),
      description: '', amount: 0, open: true, formFilled: true
    });
  }

  useEffect(() => {
    if (props.tableView) {
      setState({ ...state, type: props.type });
    }
  });

  function handleSubmit() {
    // Check if form is filled properly
    if (state.type && state.description && state.amount) {
      // If user is in table view, the expense type is passed from the parent
      props.tableView ?
        props.createExpense(props.types.find((type: any) => type.type == state.type),
          state.description, state.amount, state.date)
        :
        props.createExpense(props.types.find((type: any) => type.id == state.type),
          state.description, state.amount, state.date)
      // Close popover
      handleClose();
    } else {
      setState({ ...state, formFilled: false });
    }
  }

  function handleClose() {
    setState({ ...state, open: false });
  }

  return (
    <Fragment>
      {/* <Button
        onClick={handleClickOpen}
        style={{ display: "inline-block" }}
        color='primary'> */}
      <Button 
      color="secondary" 
      style={{ display: 'inline-block',margin:"5px" }} 
      onClick={handleClickOpen} aria-label="add">
        <AddIcon />
      </Button>
      {/* <svg xmlns={addTool}
          width="24" height="24" viewBox="0 0 24 24">
          <path d={addPath} />
        </svg>
      </Button> */}
      <Dialog disableBackdropClick disableEscapeKeyDown open={state.open} onClose={handleClose}>
        <DialogContent>
          <form className={classes.container}>
            <FormControl className={classes.formControl}>
              {/* In each field, is checked if it's properly filled before sending the request */}
              <Paper>
                <Container style={{ textAlign: "center" }}>
                  <Row>
                    <h4>
                      {
                        (!props.tableView) ?
                          props.view ? "Add expense" : `Add New Expense` :
                          `Add ${props.type} expense`
                      }
                    </h4>
                  </Row>
                  <Row className="new-expense-form">
                    <TextField
                      name="amount"
                      className="new-expense-form"
                      placeholder="0.00"
                      label={
                        state.formFilled ?
                          props.view ? "Amount" : "Expense Amount"
                          :
                          state.amount ?
                            "Amount"
                            :
                            "Required"
                      }
                      error={state.formFilled ?
                        false
                        :
                        state.amount ?
                          false :
                          true}
                      type="number"
                      onChange={handleChange("amount")}
                      InputProps={{
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                      }}
                    />
                  </Row>
                  <Row className="new-expense-form">
                    <TextField
                      id="date"
                      label="Pay on"
                      type="date"
                      defaultValue={props.view?'':state.date}
                      onChange={handleChange('date')}
                      style={{width:'100%'}}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Row>
                  <Row className="new-expense-form">
                    <TextField
                      name="description"
                      className="new-expense-form"
                      placeholder="A brief description of the expense..."
                      error={state.formFilled ?
                        false
                        :
                        state.description ?
                          false :
                          true}
                      label={
                        state.formFilled ?
                          "Description"
                          :
                          state.description ?
                            "Description"
                            :
                            "Required"
                      }
                      type="text"
                      multiline={true}
                      rows={props.view ? 4 : 5}
                      onChange={handleChange("description")} />
                  </Row>
                  {
                    (!props.tableView) &&
                    <Row className="new-expense-form">
                      <Select
                        value={state.type}
                        onChange={handleChange('type')}
                        input={<Input id="expense-type" />}
                        error={state.formFilled ?
                          false
                          :
                          state.type ?
                            false :
                            true}
                      >
                        <MenuItem value={0}>
                          <em style={
                            { color: state.formFilled ? "black" : state.type ? "black" : "red" }
                          }>
                            {state.formFilled ?
                              props.view ?
                                "Type" :
                                "Select expense type" :
                              "Required"}
                          </em>
                        </MenuItem>
                        {props.types.map((t: any) => (<MenuItem key={t.id} value={t.id}>{t.type}</MenuItem>)
                        )}
                      </Select>
                    </Row>
                  }
                </Container>
              </Paper>
            </FormControl>
          </form>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={
              // Function call to send the request for creating new expense
              handleSubmit
            }
            color="primary">
            Ok
            </Button>
          <Button
            onClick={handleClose}
            color="secondary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
}

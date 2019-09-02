import React, { Fragment } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { Paper, TextField, Container, InputAdornment } from '@material-ui/core';
import { Row } from 'reactstrap';
import Axios from 'axios';

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

export default function NewIncome(props: any) {
  const classes = useStyles();
  const [state, setState] = React.useState({
    open: false,
    type: 0, //incomeType: {id: 0, type: ''},
    description: '',
    amount: 0,
    formFilled: true
  });

  const handleChange = (name: keyof typeof state) => (
    event: React.ChangeEvent<{ value: unknown }>,
  ) => {
    setState({ ...state, [name]: event.target.value });
  };

  function handleClickOpen() {
    setState({ type: 0, description: '', amount: 0, open: true, formFilled: true });
  }


  function handleSubmit() {
    if (state.type && state.description && state.amount) {
      props.createIncome(props.types.find((type: any) => type.id == state.type), state.description, state.amount);

      handleClose();
    } else {
      setState({ ...state, formFilled: false });
    }
  }

  function handleClose() {
    setState({ ...state, open: false });
  }


  return (
    <div>
      <Fragment>
        <Button style={{ display: "inline-block" }} onClick={handleClickOpen}>Add Income</Button>
        <Dialog disableBackdropClick disableEscapeKeyDown open={state.open} onClose={handleClose}>
          <DialogContent>
            <form className={classes.container}>
              <FormControl className={classes.formControl}>
                <Container style={{ textAlign: "center" }}>
                  <Row><h4>Add Monthly Income</h4></Row>
                  <Row className="new-income-form">
                    <TextField
                      name="amount"
                      className="new-income-form"
                      placeholder="0.00"
                      label={
                        state.formFilled ?
                          props.view ? "Amount" : "Income Amount"
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
                  <Row className="new-income-form">
                    <TextField
                      name="description"
                      className="new-income-form"
                      placeholder="description"
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
                      rows={5}
                      onChange={handleChange("description")} />
                  </Row>
                  <Row className="new-income-form">
                    <Select
                      value={state.type}
                      onChange={handleChange('type')}
                      input={<Input id="income-type" />}
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
                              "Select income type" :
                            "Required"}
                        </em>
                      </MenuItem>
                      {props.types.map((t: any) => (
                        <MenuItem key={t.id} value={t.id}>{t.type}</MenuItem>
                      ))}
                    </Select>
                  </Row>
                </Container>
              </FormControl>
            </form>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleSubmit} >Ok</Button>
            <Button onClick={handleClose}>Cancel</Button>
          </DialogActions>
        </Dialog>
      </Fragment>
    </div>
  );
}

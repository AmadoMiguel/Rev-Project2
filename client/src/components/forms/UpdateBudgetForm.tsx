import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import React, { useState, useEffect } from 'react';
import { InputAdornment, ClickAwayListener, Paper } from '@material-ui/core';

export default function UpdateBudgetForm(props: any) {
  const [state, setState] = useState({
    description: '',
    type: 1,
    amount: 0
  });
  const [descriptionError, setDescriptionError] = useState(false);
  const [amountError, setAmountError] = useState(false);

  useEffect(() => {
    if (props.data) {
      setState({
        ...state,
        description: props.data.description,
        amount: props.data.amount,
        type: props.data.budgetType.id
      });
    }
  }, [props.data]);

  function handleUpdate() {
    if (state.description == '') setDescriptionError(true);
    if (state.amount <= 0) setAmountError(true);
    if (state.description == '' || state.amount <= 0) return;
    props.handleClose();
    props.handleUpdate({
      id: props.data.id,
      userId: props.data.userId,
      description: state.description,
      amount: Number(state.amount),
      budgetType: props.types.find((type: any) => type.id == state.type)
    });
  }

  function handleInputChange(e: any) {
    setDescriptionError(false);
    setAmountError(false);
    setState({
      ...state,
      [e.target.id]: e.target.value
    })
  }
  return (
    <Dialog style={{ padding: '15px' }} open={props.open} onClose={props.handleClose} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">Update Budget</DialogTitle>
      <DialogContent>
        <TextField
          style={{ paddingBottom: '15px' }}
          select
          id="type"
          label="Select type"
          value={state.type}
          SelectProps={{
            native: true,
          }}
          variant="outlined"
          placeholder='Select type'
          onChange={handleInputChange}
        >
          {props.types.map((type: any) => (
            <option key={type.id} value={type.id}>{type.type}</option>
          ))}
        </TextField><br />
        <TextField
          style={{ paddingBottom: '15px' }}
          error={descriptionError}
          id="description"
          label="Description"
          value={state.description}
          onChange={handleInputChange}
          helperText={descriptionError ? 'Required field' : ''}
        /><br />
        <ClickAwayListener onClickAway={() => {
          if (!state.amount) setState({ ...state, amount: 0 })
        }}>
          <TextField
            style={{ paddingBottom: '15px' }}
            error={amountError}
            label="Amount"
            id="amount"
            type="number"
            value={state.amount}
            InputProps={{
              startAdornment: <InputAdornment position="start" >$ </InputAdornment>
            }}
            onChange={handleInputChange}
            helperText={amountError ? 'Amount must be greater than 0' : ''}
          />
        </ClickAwayListener>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.handleClose} variant="text">
          Cancel
        </Button>
        <Button onClick={handleUpdate} color="secondary">
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
}

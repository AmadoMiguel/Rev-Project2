import { Button, ClickAwayListener, InputAdornment, Step, StepLabel, Stepper, TextField } from '@material-ui/core';
import React, { createRef, Fragment, useEffect, useState } from 'react';

function getSteps() {
  return ['Select a type', 'Describe your budget', 'Set an amount'];
}

export function CreateBudgetStepper(props: any) {
  const [hasError, setHasError] = useState(false);
  // Desktop stepper
  const [activeStep, setActiveStep] = useState(0);
  const steps = getSteps();

  const scrollRef: any = createRef();

  const [inputState, setInputState] = useState({
    type: 1,
    description: '',
    amount: 0
  })

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function handleInputChange(e: any) {
    setHasError(false);
    setInputState({
      ...inputState,
      [e.target.id]: e.target.value
    })
  }

  function handleNext() {
    switch (activeStep) {
      case 1:
        if (inputState.description == '') setHasError(true);
        else setActiveStep(prevActiveStep => prevActiveStep + 1);
        break;
      default:
        setActiveStep(prevActiveStep => prevActiveStep + 1);
        break;
    }
  }

  function handleBack() {
    setActiveStep(prevActiveStep => prevActiveStep - 1);
  }

  function handleReset() {
    setActiveStep(0);
  }

  function handleSubmit() {
    if (!inputState.amount || inputState.amount <= 0) {
      setHasError(true);
      return;
    }
    handleReset();
    const data = {
      userId: props.userId,
      budgetType: props.types.find((type: any) => type.id == inputState.type),
      description: inputState.description,
      amount: Number(inputState.amount)
    }
    props.handleSubmit(data);
  }

  function handleCancel() {
    handleReset();
    props.handleCancel();
  }

  function getStepContent() {
    switch (activeStep) {
      case 1:
        return (
          <TextField
            error={hasError}
            style={{ width: props.isMobileView ? '97%' : '400px' }}
            id='description'
            value={inputState.description}
            label='Description'
            variant='outlined'
            onChange={handleInputChange}
            helperText={hasError ? 'Required' : undefined}
          />
        );
      case 0:
        return (
          <TextField
            select
            id="type"
            label="Select type"
            value={inputState.type}
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
          </TextField>
        );
      case 2:
        return (
          <ClickAwayListener onClickAway={() => {
            if (!inputState.amount) setInputState({ ...inputState, amount: 0 })
          }}>
            <TextField
              error={hasError}
              id='amount'
              label='Amount'
              value={inputState.amount}
              variant='outlined'
              type='number'
              InputProps={{
                startAdornment: <InputAdornment position="start" >$ </InputAdornment>
              }}
              onChange={handleInputChange}
              helperText={hasError ? 'Amount must be greater than 0' : undefined}
            />
          </ClickAwayListener >
        );
      default:
        return (
          <Fragment />
        );
    }
  }

  return (
    <div>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map(step => (
          <Step key={step}>
            <StepLabel>{step}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <div>
        {getStepContent()}
        <div style={{ marginTop: '10px' }}>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
            color='inherit'>
            Back
                </Button>
          <Button style={{ marginLeft: '10px' }} variant="contained" color="secondary"
            onClick={activeStep === steps.length - 1 ? handleSubmit : handleNext}>
            {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
          </Button>
          <br />
          <Button ref={scrollRef} onClick={handleCancel} variant='text' color="secondary" style={{ marginTop: '10px' }}>
            Cancel
                </Button>
        </div>
      </div>
    </div>
  );
}

export default CreateBudgetStepper;

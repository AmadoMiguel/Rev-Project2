import React, { Fragment } from 'react';
import DonutGraph from '../data/DonutGraph';
import NewExpense from './NewExpenseDialog';
import { FormControlLabel, Checkbox } from '@material-ui/core';

function DonutPerspective(props:any) {
    return (
        <Fragment>
            {((props.expenses.length == 1 && props.expenses[0].id != 0)
            || props.expenses.length > 1) &&
            <div>
                <h3>{props.showMonthly ? "This month" : "Overall"} expenses:
                {props.loading ? "..." : props.showMonthly ? " $" + props.monthExpTotal : 
                " $" + props.expTotal}</h3>
                <i style={{ color: 'grey', fontSize: '14px' }}>
                Click on any section of the graphic to view details.</i>
                <DonutGraph
                data={props.graphData}
                labels={props.labels}
                important='Emergency'
                isMobileView={props.view}
                handleElementClick={props.selectedType} />
                <NewExpense
                types={props.expTypes}
                createExpense={props.createExpense}
                view={props.view} />
                {/* Toggles between view monthly expenses and overall expenses */}
                <FormControlLabel
                control= {
                    <Checkbox
                    checked={props.showMonthly}
                    onChange={props.showMonthly ? () => props.viewMonthlyExpenses(false) :
                        () => props.viewMonthlyExpenses(true)}
                    value="checkedB"
                    color="primary" />
                }
                style= {{ marginLeft: '5px' }}
                label= "This month" />
            </div>
            }
        </Fragment>
    )
}

export default DonutPerspective;
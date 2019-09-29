import React from 'react';
import colors from '../../assets/Colors';
import NewExpense from './NewExpenseDialog';

function NoExpenses(props: any) {
    return (
        <div style={{
                marginTop: '50px', marginRight: 'auto', marginLeft: 'auto', textAlign: 'center',
                color: colors.teal, width: "60%", backgroundColor: colors.unusedGrey
        }}>
            <h2 style={{ marginBottom: '40px' }}>
                Start setting up your expenses, {props.firstName}. <br /> <br /> <br />
                What about a new one?
            </h2> <br />
            <NewExpense
            types={props.types}
            createExpense={props.createExpense}
            view={props.view} />
        </div>
    )
}

export default NoExpenses;
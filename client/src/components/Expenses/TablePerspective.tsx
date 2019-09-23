import React, { Fragment } from 'react';
import { Row, Col, Container} from 'reactstrap';
import NewExpense from './NewExpenseDialog';
import { BarLoader } from 'react-spinners';
import { ExpensesTable } from './ExpensesTablesComponent';
import { Button } from '@material-ui/core';

function TablePerspective(props:any) {
    return (
        <Fragment>
            <Container>
            <Row>
                <Col>
                <Button
                    color="secondary"
                    onClick={() => props.setShowTable(false)}
                    style={{ display: "inline-block", margin: '5px' }}>
                    Back
            </Button>
                {/* If on table perspective, don't show the type selector */}
                <NewExpense
                    types={props.types}
                    createExpense={props.createExpense}
                    view={props.view}
                    tableView={props.tableView}
                    type={props.type} />
                </Col>
            </Row>
            </Container>
            {
            props.loading
                ?
                <div
                style={{
                    margin: props.view ? '75px' : '150px',
                    display: 'inline-block'
                }}>
                <BarLoader width={150} color={'#009688'} loading={props.loading} />
                </div>
                :
                <ExpensesTable expenses={props.tabExpenses}
                view={props.view}
                deleteExpense={props.delExpense}
                updateExpense={props.updExpense} />
            }
        </Fragment>
    )
}

export default TablePerspective;
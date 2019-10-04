import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { configure, shallow, mount } from 'enzyme';
import DonutPerspective from '../DonutPerspective';
import DonutGraph from '../../data/DonutGraph';
import { FormControlLabel, Checkbox } from '@material-ui/core';
import { Doughnut } from 'react-chartjs-2';

const generalGraphData = [
    {
        key: "Bills",
        data: 140
    },
    {
        key: "Entertainment",
        data: 310
    }
]
const thisMonthGraphData = [
    {
        key: "Bills",
        data: 30
    }, 
    {
        key: "Entertainment",
        data: 310
    }
]

const props:any = {
    // Mock three expenses (two for this month and one for previous month)
    expenses: [
        {
            id: 1,
            userId: 3,
            user: null,
            expenseType: {
                id: 4,
                type: "Entertainment"
            },
            date: new Date().toISOString(),
            description: "Yesterday party",
            amount: 310
        },
        {
            id: 2,
            userId: 3,
            user: null,
            expenseType: {
                id: 1,
                type: "Bills"
            },
            date: "12-09-2019",
            description: "House services",
            amount: 110
        },
        {
            id: 3,
            userId: 3,
            user: null,
            expenseType: {
                id: 1,
                type: "Bills"
            },
            date: "01-10-2019",
            description: "Cellphone bill",
            amount: 30
        }
    ],
    expTotal: 450,
    expTypes: [
        {id: 1,
        type: "Bills"},
        {id: 2,
        type: "Food"},
        {id: 3,
        type: "Emergency"},
        {id: 4, 
        type: "Entertainment"},
        {id: 5,
        type: "Other"}
    ],
    monthExpTotal: 340,
    loading: false,
    showMonthly: false,
    graphData: () => {
        return props.showMonthly ? thisMonthGraphData : generalGraphData
    },
    labels: {},
    view: false,
    selectedType: jest.fn().mockImplementation(),
    createExpense: jest.fn().mockImplementation(),
    viewMonthlyExpenses: jest.fn().mockImplementation((status:boolean) => props.showMonthly = status)
}
// Assign labels for the donut graph
props.labels = props.expTypes.map((t:any) => t.type);

configure({adapter: new Adapter()});
describe("Testing <DonutPerspective />", () => {
    it("<h3><h3/> content should be rendered with the proper information", () => {
        const donutPerspectiveMock = shallow(<DonutPerspective {...props} />);
        const h3Mock = donutPerspectiveMock.find("h3");
        const text = "Overall expenses: $450";
        expect(h3Mock.text()).toEqual(text);
    });
    it("the donut graph should exist and should contain general expenses data", () => {
        const donutPerspectiveMock = shallow(<DonutPerspective {...props} />);
        // Find the donut graph component
        const donutGraphMock = donutPerspectiveMock.findWhere(node => node.is(DonutGraph));
        // Verify that is rendered since the expenses array is not empty
        expect(donutGraphMock.exists()).toBeTruthy();
        // Get the data property and compare to the general expenses since the
        // showMonthly property is set to false
        const dataProp = donutGraphMock.prop("data");
        expect(dataProp()).toEqual(generalGraphData);
    });
    it("checking current month expenses checkbox works properly", () => {
        const donutPerspectiveMock = shallow(<DonutPerspective {...props} />);
        // Find the form control label component
        const formControlMock = donutPerspectiveMock.findWhere(node => node.is(FormControlLabel));
        // Get the checkBox
        const checkBoxMock = formControlMock.prop("control");
        // Simulate an onChange event, which basically toggles the value of showMonthly
        checkBoxMock.props.onChange();
        // Expect that the monthly expenses are activated since initially are disabled
        expect(props.viewMonthlyExpenses).toHaveBeenCalledWith(true);
        // Verify that props.showMonthly was set to true
        expect(props.showMonthly).toBeTruthy();
    });
    it("showMonthly property affects the donut graph data", () => {
        let donutPerspectiveMock = shallow(<DonutPerspective {...props} />);
        // Since the showMonthly property was set to true on the previous test, it
        // should be enabled here and the donut graph should reflect that
        let donutGraphMock = donutPerspectiveMock.findWhere(node => node.is(DonutGraph));
        expect(donutGraphMock.prop("data")()).toEqual(thisMonthGraphData);
    });
    it("when mounting <DonutGraph />, <Doughnut /> should be visible when having data", () => {
        const donutGraphMock = mount(
            <DonutGraph 
            data = {props.graphData()}
            labels = {props.labels}
            important = "Emergency"
            isMobileView = {props.view}
            handleElementClick = {props.selectedType}/>);
        const doughnutMock = donutGraphMock.findWhere(node => node.is(Doughnut));
        expect(doughnutMock.exists()).toBeTruthy(); 
    });
    it("when clicking an element of the doughnut graph it should pass the label to the parent", () => {
        // In this case, mount() is used in order to call the hook methods during the test
        const donutGraphMock = mount(
            <DonutGraph 
            data = {props.graphData()}
            labels = {props.labels}
            important = "Emergency"
            isMobileView = {props.view}
            handleElementClick = {props.selectedType}/>);
        const doughnutMock = donutGraphMock.findWhere(node => node.is(Doughnut));
        // Simulate the function getElementAtEvent with label # 2 (Entertainment) of general graph data
        // This is the function that is called internally when the user clicks a portion of the
        // donut graph
        doughnutMock.props().getElementAtEvent([{_index: 1}]);
        expect(props.selectedType).toHaveBeenCalledWith("Entertainment");
    });
});
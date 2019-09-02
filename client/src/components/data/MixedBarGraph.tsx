import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import colors from '../../assets/Colors';

function shadeColor(col: string, amt: number) {
  let usePound = false;
  if (col[0] == "#") {
    col = col.slice(1);
    usePound = true;
  }
  let num = parseInt(col, 16);
  let r = (num >> 16) + amt;
  if (r > 255) r = 255;
  else if (r < 0) r = 0;
  let b = ((num >> 8) & 0x00FF) + amt;
  if (b > 255) b = 255;
  else if (b < 0) b = 0;
  let g = (num & 0x0000FF) + amt;
  if (g > 255) g = 255;
  else if (g < 0) g = 0;
  return (usePound ? "#" : "") + (g | (b << 8) | (r << 16)).toString(16);
}

export default function MixedBarGraph(props: any) {
  const [data, setData] = useState();
  useEffect(() => {
    // Create the graph data.
    const incomeTotal = !props.incomes ? 0 :
      props.incomes.map((item: any) => item.amount).reduce((a: any, b: any) => a + b);
    const budgetTotal = !props.budgets ? 0 :
      props.budgets.map((item: any) => item.amount).reduce((a: any, b: any) => a + b);
    const expensesTotal = !props.expenses ? 0 :
      props.expenses.map((item: any) => item.amount).reduce((a: any, b: any) => a + b);

    setData({
      labels: ['Total ($)'],
      datasets: [{
        label: 'Incomes',
        type: 'bar',
        data: [incomeTotal],
        fill: false,
        borderColor: colors.lightGreen,
        backgroundColor: colors.lightGreen,
        hoverBackgroundColor: shadeColor(colors.lightGreen, 50),
        hoverBorderColor: shadeColor(colors.lightGreen, 50),
      }, {
        type: 'bar',
        label: 'Budgets',
        data: [budgetTotal],
        fill: false,
        backgroundColor: colors.teal,
        hoverBackgroundColor: shadeColor(colors.teal, 50),
        hoverBorderColor: shadeColor(colors.teal, 50),
      }, {
        type: 'bar',
        label: 'Expenses',
        data: [expensesTotal],
        fill: false,
        backgroundColor: colors.orange,
        hoverBackgroundColor: shadeColor(colors.orange, 50),
        hoverBorderColor: shadeColor(colors.orange, 50),
      }],
    })
  }, [props.expenseData, props.budgetData, props.labels])


  return (
    (
      data ? (
        <Bar
          data={data}
          width={500}
          height={props.isMobileView ? 500 : 400}
          options={{
            scales: {
              yAxes: [{
                display: true,
                ticks: {
                  beginAtZero: true
                }
              }],
            },
          }}
        />
      ) : (
          <></>
        ))
  );
};

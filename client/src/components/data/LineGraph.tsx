import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import colors from '../../assets/Colors';

export default function LineGraph(props: any) {
  const [data, setData] = useState();
  useEffect(() => {
    const dataArr = new Array(3);
    setData({
      labels: props.months,
      datasets: [
        {
          label: 'Expenses',
          fill: false,
          lineTension: 0.1,
          backgroundColor: colors.orange,
          borderColor: colors.orange,
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: colors.orange,
          pointBackgroundColor: colors.orange,
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: colors.orange,
          pointHoverBorderColor: colors.orange,
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: props.expenseTotals
        },
        {
          label: 'Income',
          fill: false,
          lineTension: 0.1,
          backgroundColor: colors.offWhite,
          borderColor: 'rgba(0,0,255,.24)',
          borderCapStyle: 'butt',
          borderDash: [10, 5],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: 'rgba(0,0,255,.24)',
          pointBackgroundColor: '#fff',
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: 'rgba(0,0,255,.24)',
          pointHoverBorderColor: 'rgba(0,0,255,.24)',
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: props.income
        },
        {
          label: 'Budget',
          fill: false,
          lineTension: 0.1,
          backgroundColor: colors.offWhite,
          borderColor: colors.green,
          borderCapStyle: 'butt',
          borderDash: [10, 5],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: colors.green,
          pointBackgroundColor: colors.green,
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: colors.green,
          pointHoverBorderColor: colors.green,
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: props.budget
        }
      ]


    })



  }, [props.months, props.expenseTotals])

  return (
    (data.length ?
      <Line data={data}
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
        }} /> : <></>)
  );

}

import React, { Fragment, useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { colorTypes } from '../../assets/Colors';

/**
 * Main Function
 * @function VerticalBarGraph
 * @param props.labels - array of strings
 * @param props.data - array of objects of type { key: string, data: number }
 * @param props.isMobileView - should be provided so the graph can properly scale itself
 * @param props.handleElementClick - will return the string label of a clicked section
 * So long as the props adhere to the above specs the graph should work properly 
 */

export function VerticalBarGraph(props: any) {
  const [data, setData] = useState();
  useEffect(() => {
    // Create the graph data.
    if (props.data.length !== 0) {
      let dataArr = Array.from(props.labels, () => 0);
      props.data.forEach((e: any) => {
        dataArr[props.labels.indexOf(e.key)] += e.data;
      });

      const labels = props.labels.filter((i: any) => dataArr[props.labels.indexOf(i)] > 0)
      dataArr = dataArr.filter((i: number) => i > 0);

      setData({
        labels: labels,
        datasets: [{
          data: dataArr,
          backgroundColor: getBackgroundColors(labels, props.important),
          hoverBackgroundColor: getHoverColors(labels, props.important),
        }]
      })
    }
  }, [props.data, props.labels, props.important])

  function handleElementClick(e: any) {
    // Sends the corresponding label as a string
    if (data && data.labels && e[0] && props.handleElementClick)
      props.handleElementClick(data.labels[e[0]._index]);
  }

  return (data ?
    <Bar
      width={props.isMobileView ? 300 : 150}
      height={props.isMobileView ? 300 : 300}
      data={data}
      getElementAtEvent={handleElementClick}
      legend={{ display: false }}
      options={{
        scales: {
          yAxes: [{
            display: true,
            ticks: {
              beginAtZero: true
            }
          }]
        },
      }}
    />
    : <Fragment />
  );
}

function getBackgroundColors(labels: any, important?: string) {
  let index = 0;
  return labels.map((label: string) => {
    // We can set certain colors based off labels here
    if (important) return label === important ? colorTypes.important
      : colorTypes.donut[index++]
    else return label === 'Emergency' ? colorTypes.important
      : colorTypes.donut[index++];
  });
}

function getHoverColors(labels: any, important?: string) {
  /// Positive amount is darken, negative is lighten
  const amount = 50;
  let index = 0;
  return labels.map((label: string) => {
    if (important) return label === important ? shadeColor(colorTypes.important, amount)
      : shadeColor(colorTypes.donut[index++], amount);
    else return label === 'Emergency' ? shadeColor(colorTypes.important, amount)
      : shadeColor(colorTypes.donut[index++], amount);
  });
}

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

export default VerticalBarGraph                            

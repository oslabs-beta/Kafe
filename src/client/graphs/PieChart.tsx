import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import sha256 from 'crypto-js/sha256';
import ChartStreaming from "chartjs-plugin-streaming";

function djb2(str){
    var hash = 5381;
    for (var i = 0; i < str.length; i++) {
      hash = ((hash << 5) + hash) + str.charCodeAt(i); /* hash * 33 + c */
    }
    return hash;
};
  
function hashStringToColor(str) {
  
  const cryptoStr = sha256(str).toString();

  const hash = djb2(cryptoStr);
  const r = (hash & 0xFF0000) >> 15;
  const g = (hash & 0x00FF00) >> 8;
  const b = hash & 0x0000FF;

  return `rgba(${r}, ${g}, ${b}, 0.3)`;
};

const PieChart = ({ label, labels, data}) => {
  const [backgroundColors, setBackgroundColors] = useState([]);
  const chartRef = useRef(null);
  ChartJS.register(ArcElement, Tooltip, Legend);
  ChartJS.unregister(ChartStreaming);

  useEffect(() => {
    const colors = [];
    
    for (const label of labels) {
        colors.push(hashStringToColor(label))
    };

    setBackgroundColors(colors);
  }, [labels]);

  const options = {
    responsive: true,
    streaming: false,
    plugins: {
        legend: {
            position: 'top' as const,
        },
        title: {
            display: true,
            text: label,
        },
        datalabels: {
            display: true,
            formatter: (value, ctx) => {
                const data = ctx.chart.data.datasets[0].data;
                const sum = data.reduce((p, c) => p + c, 0);
                const percentage = ((value / sum) * 100).toFixed(2) + '%';

                return percentage;
            },
        },
        tooltips: {
            enabled: true,
            mode: 'nearest',
            intersect: false,
        },
    },
    
  };

  console.log(labels, data);
  console.log(chartRef.current);

  return (
        <Pie 
            data={{
                labels,
                datasets: [{
                  label,
                  data,
                  backgroundColor: backgroundColors,
                  borderColor: backgroundColors,
                  hoverOffset: 8,
                  borderWidth: 1,     
                }],          
            }}
            options={options}
            ref={chartRef}/>
    );
};

export default PieChart;
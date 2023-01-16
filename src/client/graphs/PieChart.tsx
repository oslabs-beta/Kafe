import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import sha256 from 'crypto-js/sha256';

ChartJS.register(ArcElement, Tooltip, Legend);

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

  useEffect(() => {
    const colors = [];
    
    for (const label of labels) {
        colors.push(hashStringToColor(label))
    };

    setBackgroundColors(colors);
  }, [labels]);

  const options = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top' as const,
        },
        title: {
            display: true,
            text: label,
        },
    },
  };

  console.log(labels, data);

  return (
        <Pie 
            data={{
                labels,
                datasets: [{
                  label,
                  data,
                  backgroundColor: backgroundColors,
                  borderWidth: 1,     
                }],          
            }}
            options={options}
            ref={chartRef}
            redraw={true}/>
    );
};

export default PieChart;
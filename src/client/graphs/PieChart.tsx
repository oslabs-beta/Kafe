import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import bcrypt from 'bcryptjs-react';

ChartJS.register(ArcElement, Tooltip, Legend);

function djb2(str){
    var hash = 5381;
    for (var i = 0; i < str.length; i++) {
      hash = ((hash << 5) + hash) + str.charCodeAt(i); /* hash * 33 + c */
    }
    return hash;
};
  
function hashStringToColor(str) {
  const salt = bcrypt.genSaltSync(5);
  const bcryptHash = bcrypt.hashSync(str, salt);

  const hash = djb2(bcryptHash);
  const r = (hash & 0xFF0000) >> 16;
  const g = (hash & 0x00FF00) >> 8;
  const b = hash & 0x0000FF;

  return `rgba(${r}, ${g}, ${b}, 0.3)`;
};



const PieChart = ({ label, labels, data}) => {
  const [backgroundColors, setBackgroundColors] = useState([]);
  
  useEffect(() => {
    const colors = [];
    
    for (const label of labels) {
        colors.push(hashStringToColor(label))
    };

    setBackgroundColors(colors);
  }, [labels]);
  
  console.log('Colors: ', backgroundColors);
  return (
    <Pie data={{
        labels,
        datasets: [{
          label,
          data,
          backgroundColor: backgroundColors,
          borderWidth: 1,
        }]
    }}/>
    );
};

export default PieChart;
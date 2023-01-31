import React, { useEffect, useState } from 'react';
import { Bar } from  'react-chartjs-2';
import sha256 from 'crypto-js/sha256';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';


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


const BarChart = ({ dlqData, label }) => {
  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );

  const [validDLQ, setValidDLQ] = useState({});
  const [timeInput, setTimeInput] = useState<string | number>('');
  const [backgroundColor, setBackgroundColor] = useState([]);

  const handleTimeChange = (event: SelectChangeEvent) => {
    console.log('Setting time to: ', typeof (event.target.value));
    setTimeInput(event.target.value);
  }

  useEffect(()=> {
    const newBarChartData = {};

    if(!timeInput) {
      for (const dlq of dlqData) {
        const dlqTopic = dlq.value.originalTopic;
        if(newBarChartData[dlqTopic]) newBarChartData[dlqTopic] += 1;
        else newBarChartData[dlqTopic] = 1;
      }
   } else {
      for (const dlq of dlqData) {
        const dlqTopic = dlq.value.originalTopic;
        const dlqTimeStamp = new Date(dlq.timestamp);
        const timeThreshold = new Date(new Date(Date.now()).getTime() - (+timeInput * 60000));
        if(dlqTimeStamp >= timeThreshold) {
          if(newBarChartData[dlqTopic]) newBarChartData[dlqTopic] += 1;
          else newBarChartData[dlqTopic] = 1;
        }
      }
   }
   setValidDLQ(newBarChartData);

  }, [timeInput, dlqData]);

  useEffect(() => {
    const colors = [];
    for (const topic in validDLQ) {
      colors.push(hashStringToColor(topic));
    };

    setBackgroundColor(colors);
  }, [validDLQ])

return(
    <>
      <div>
        <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
          <InputLabel id="dlq-time-interval">Time Interval</InputLabel>
          <Select
            labelId="dlq-time-select"
            id="dlq-time-select-component"
            value={timeInput}
            onChange={handleTimeChange}
            label="Time"
          >
            <MenuItem value={0}>
              <em>None</em>
            </MenuItem>
            <MenuItem value={1}>One</MenuItem>
            <MenuItem value={5}>Five</MenuItem>
            <MenuItem value={10}>Ten</MenuItem>
          </Select>
        </FormControl>
        Bar Chart
      </div>
      {Object.keys(validDLQ).length > 0 ?
        <Bar
          data={{
            labels: Object.keys(validDLQ),
            datasets: [{
              label,
              data: Object.values(validDLQ),
              backgroundColor,
              borderColor: backgroundColor,
              borderWidth: 1,
            }],
        }}
        /> :
        <div>{`Nice, no failed messages in the last ${timeInput} minute(s)!`}</div>}
    </>
  )
};

export default BarChart;
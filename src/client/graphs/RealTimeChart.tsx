import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { useQuery } from "@apollo/client";
import ChartStreaming from "chartjs-plugin-streaming";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

import { BROKERS_CPU_USAGE } from '../queries/graphQL';

// ChartJS.register(ChartStreaming);

const RealTimeChart = (props) => {

  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

  const colors = ["rgba(75,192,192,1)", "#ecf0f1", "#50AF95", "#f3ba2f", "#2a71d0"];

  //Get current time/date for end paramter of Broker CPU query
  const now = new Date();

  //GraphQL query to the backend
  const { loading, data, refetch } = useQuery(BROKERS_CPU_USAGE, {
    variables: {
      start: new Date(+now - 60000 * 10).toString(),
      end: now.toString(),
      step: '60s',
    },
   });
  
  console.log('RealTimeChart: ', loading, data);

  useEffect(() => {
    if (loading) return;

    const labels = data.brokers[0].JVMMemoryUsedOverTime[0].values.map(series => series.time);
    const datasets = [];

    data.brokers.forEach((broker, index) => {
      const dataSet = {
        label: `Broker ${broker.id}`,
        backgroundColor: `${colors[index]}`,
        borderColor: `${colors[index]}`,
        pointRadius: 0,
        tension: 2,
        data: broker.JVMMemoryUsedOverTime[0].values.map(series => series.value),
      };
      datasets.push(dataSet)
      console.log(dataSet)
    });

    setChartData({labels, datasets})
  }, [loading]);

  console.log(chartData);
  return (
    <Line data={chartData}/>
  )
};

export default RealTimeChart;
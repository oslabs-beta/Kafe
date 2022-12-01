import React from 'react';
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
// import 'chartjs-adapter-luxon';
import { BROKERS_CPU_USAGE } from '../queries/graphQL';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

ChartJS.register(ChartStreaming);

const RealTimeChart = (props) => {
  const { loading, data, refetch } = useQuery(BROKERS_CPU_USAGE, {
    variables: {
      start: "Tue Nov 29 2022 19:08:46 GMT-0800 (Pacific Standard Time)",
      end: "Tue Nov 29 2022 19:19:27 GMT-0800 (Pacific Standard Time)",
      step: '60s',
    },
   });

   console.log(loading, data)

  return (
    <div>{'Real Time Chart'}</div>
  )
};

export default RealTimeChart;
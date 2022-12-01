// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { useQuery } from "@apollo/client";
import ChartStreaming from "chartjs-plugin-streaming";
import "chartjs-adapter-luxon";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  ChartStreaming
);

import { BROKERS_CPU_USAGE, BROKER_JVM_MEMORY_USAGE } from '../queries/graphQL';

// ChartJS.register(ChartStreaming);

const RealTimeChart = (props) => {

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text:'% CPU Usage Over Time',
      },
      streaming: {
        duration: 10000 * 60,
        delay: 60 * 1000,
        refresh: 60 * 1000,
        onRefresh: (chart) => {
          const queryVariables = {
            start: now.toString(),
            end: new Date().toString(),
            step: '60s',
          };
          now = new Date(queryVariables.end);
          // console.log('chart dataset before refetch', chart.data.datasets);
          refetch({...queryVariables}).then((queryResult) => {


            if (!loading) {
              console.log('Refetched data: ', queryResult);

              // chart.data.labels = queryResult.data.brokers[0].CPUUsageOverTime[0].values.map(series => series.time)
              queryResult.data.brokers.forEach((broker, index) => {
                console.log('query for each loop ', chart.data.datasets[index])
                broker.CPUUsageOverTime[0].values.forEach(series => {
                  console.log('broker cpuusage loop ', series)
                  chart.data.datasets[index].data.push(series.value)
                });
                console.log('query for each loop after push ', chart.data.datasets[index])
              });

              console.log('check to see if new value added to array:', chart.data.datasets)
              // chart.data.datasets.forEach((dataset, index) => {
                // const newData = [12.01, 12.02, 12.03, 12.04, 12.60, 12.11, 12.12, 12.13];

                //  queryResult.data.brokers[index]['CPUUsageOverTime'][0].values.forEach(data => {
                //    newData.push(data.value);
                //  })
                //  dataset.data = newData;
              //    console.log('newDataSet:', chart.data.datasets);
              // })
            };

            chart.update('quiet');
          })
        },
      }
    },
    scales: {
      xAxes: {
        type: 'realtime'
      },
    },
  }

  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

  const colors = ["rgba(75,192,192,1)", "#ecf0f1", "#50AF95", "#f3ba2f", "#2a71d0"];

  //Get current time/date for end paramter of Broker CPU query
  let now = new Date();

  //GraphQL query to the backend
  const { loading, data, refetch } = useQuery(BROKERS_CPU_USAGE, {
    variables: {
      start: new Date(+now - 60000 * 10).toString(),
      end: now.toString(),
      step: '60s',
    },
    fetchPolicy: "network-only",
    nextFetchPolicy: "network-only",
    notifyOnNetworkStatusChange: true,
   });

  // console.log('RealTimeChart: ', loading, data);

  useEffect(() => {
    if (loading) return;

    // const labels = data.brokers[0].CPUUsageOverTime[0].values.map(series => series.time);
    const labels = [];
    const datasets = [];

    data.brokers.forEach((broker, index) => {
      const dataSet = {
        label: `Broker ${broker.id}`,
        backgroundColor: `${colors[index]}`,
        borderColor: `${colors[index]}`,
        pointRadius: 0,
        tension: 0.5,
        data: broker.CPUUsageOverTime[0].values.map(series => series.value)
      };
      datasets.push(dataSet)
      console.log('new Data Set', dataSet)
    });

    setChartData({labels, datasets})
  }, [loading]);

  // console.log(chartData);
  return (
    <Line data={chartData} options={options}/>
  )
};

export default RealTimeChart;
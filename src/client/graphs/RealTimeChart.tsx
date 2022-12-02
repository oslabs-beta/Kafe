// @ts-nocheck
import React, { useState, useEffect, useRef, useMemo } from 'react';
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
  TimeScale,
  ChartOptions
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

const RealTimeChart = () => {

  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

  const colors = ["#003f5c", "#bc5090", "#ffa600", "#58508d", "#2a71d0"];

  //Get current time/date for end paramter of Broker CPU query
  const now = useRef(new Date(Date.now() - 60 * 1000 * 10 * 2));
  const loaded = useRef(false);
  const chartRef = useRef(null);

  const options = {
    responsive: true,
    //feed time stamp to x axis, value to y
    // parsing: {
    //   xAxisKey: "time",
    //   yAxisKey: "value",
    // },
    elements: {
      line: {
        tension: 0.4,
      },
    },
    plugins: {
      title: {
        display: true,
        text: '% CPU Usage Over Time',
      },
      streaming: {
        duration: 5 * 60000,
        delay: 10 * 1000,
        refresh: 60 * 1000,
        onRefresh: (chart) => {
          
          chart.data.datasets.forEach(dataset => {
              dataset.data.push({
                  "x": Date.now(),
                  "y": Math.random() * 99
              });
          });

          // const variables = {
          //   start: now.current.toString(),
          //   end: new Date().toString(),
          //   step: step,
          // };
          // timeNow.current = new Date(variables.end);
          // refetch({ ...variables }).then((result) => {
          //   if (loaded.current) {
          //     result.data[resource].forEach((series, index) => {
          //       series[`${metric}`].forEach((point) => {
          //         chart.data.datasets[index].data.push(point);
          //       });
          //     });
          //     console.log('Refteched data:', chart.data.datasets, 'Refetched labels:', chart.data.labels);
          //   }

          //   chart.update("quiet");
          // });
        },
      },
    },
    scales: {
      x: {
        type: "realtime",
        // realtime: {
        //   duration: 60 * 1000,
        //   delay: 20 * 1000,
        //   refresh: 30 * 1000,
        //   onRefresh: (chart) => {
        //     console.log('Starting time: ', now)
        //     const queryVariables = {
        //       start: new Date(Date.now() - 20 * 60 * 1000),
        //       end: new Date().toString(),
        //       step: '30s',
        //     };
        //     now.current = new Date(queryVariables.end);
        //     // console.log('chart dataset before refetch', chart.data.datasets);
        //     refetch({...queryVariables})
        //       .then(queryResult => {
        //         if (!loading) {

        //           console.log('Query Result: ', queryResult);
        //           console.log('Initial char data: ', chart.data.datasets);
        //           queryResult.data.brokers.forEach((broker, index) => {
        //             // console.log('For each loop start data ', chart.data.datasets[index]);
        //             broker.CPUUsageOverTime.forEach((series) => {
        //               chart.data.datasets[index].data.push({
        //                 'x': series.time,
        //                 'y': series.value,
        //               });
        //             });
                    
        //             console.log('For each loop end data ', chart.data.datasets[index])
        //           });
        //         };
        //         chart.update('quiet');
        //       }).catch(err => console.log(err));
        // },
        time: {
          unit: "minute",
          parser: (label: string) => new Date(label).getTime(),
          stepSize: 0.5,
          displayFormats: {
            minute: "HH:mm:ss",
          },
        },
        adapters: {
          date: {
            local: "en-us",
            setZone: true,
          },
        },
        ticks: {
          autoSkip: true,
          maxRotation: 45,
          minRotation: 45,
        },
      },
    },
      y: {
        stacked: true,
        min: 0,
        max: 100,
        title: {
          display: true,
          text: 'CPU Usage'
      },
    },
  },
  

  //GraphQL query to the backend
  const { loading, data, refetch } = useQuery(BROKERS_CPU_USAGE, {
    variables: {
      start: new Date(Date.now() - 60000 * 10).toString(),
      end: new Date().toString(),
      step: '60s',
    },
    fetchPolicy: "network-only",
    nextFetchPolicy: "network-only",
    notifyOnNetworkStatusChange: true,
   });

  useEffect(() => {
    //make sure initial page load done ss
    if (loading || loaded.current) return;
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
        showLine: true,
        data: broker.CPUUsageOverTime.map(series => series = {'x': series.time, 'y': series.value})
        
      };
      datasets.push(dataSet);
      console.log('Datasets after pushing:', datasets);
    });

    setChartData({ labels, datasets });

    //clear up side effect
    return () => (loaded.current = true);
  }, [loading]);

  useEffect(() => {
    loaded.current = false;
  }, []);

  return (
    <>
      {useMemo(() => {
        return loading && !loaded.current ? (
          <div>Loading...</div>
        ) : (
          <Line options={options} data={chartData} ref={chartRef} />
        );
      }, [chartData])}
    </>
  );
};

export default RealTimeChart;
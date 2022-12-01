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

const RealTimeChart = (props) => {

  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

  const colors = ["#003f5c", "#bc5090", "#ffa600", "#58508d", "#2a71d0"];

  //Get current time/date for end paramter of Broker CPU query
  const now = useRef(new Date());
  const loaded = useRef(false);
  const chartRef = useRef(null);

  //GraphQL query to the backend
  const { loading, data, refetch } = useQuery(BROKERS_CPU_USAGE, {
    variables: {
      start: new Date(now.current.valueOf() - 10 * 60000 * 2).toString(),
      end: now.current.toString(),
      step: '60s',
    },
    fetchPolicy: "network-only",
    nextFetchPolicy: "network-only",
    notifyOnNetworkStatusChange: true,
   });

  useEffect(() => {
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
        data: broker.CPUUsageOverTime.map(series => series = {x: series.time, y: series.value})
      };
      datasets.push(dataSet)
      console.log('Use Effect Data: ', dataSet)
    });

    setChartData({ labels, datasets });

    return () => (loaded.current = true);
  }, [loading]);

  useEffect(() => {
    loaded.current = false;
  }, []);

  const options: ChartOptions<'line'> = {
    responsive: true,
    // parsing: {
    //   xAxisKey: "time",
    //   yAxisKey: "CPU",
    // },
    plugins: {
      title: {
        display: true,
        text:'% CPU Usage Over Time',
      },
      streaming: {
        duration: 5 * 60 * 10000,
        delay: 30 * 1000,
        refresh: 30 * 1000,
        ttl: false,
        onRefresh: (chart) => {
          chart.data.datasets.forEach(dataset => {
            dataset.data.push({
              x: Date.now().toString(),
              y: Math.random() * 99,
            })
          });
          chart.update('quiet');
          console.log('Streaming: ', chart.data.datasets)
          // const queryVariables = {
          //   start: now.current.toString(),
          //   end: new Date().toString(),
          //   step: '60s',
          // };
          // now.current = new Date(queryVariables.end);
          // // console.log('chart dataset before refetch', chart.data.datasets);

          // refetch({...queryVariables}).then((queryResult) => {

          //   if (loaded.current) {
          //     console.log('Refetched data: ', queryResult);

          //     queryResult.data.brokers.forEach((broker, index) => {
          //       console.log('For each loop start data ', chart.data.datasets[index]);

          //       broker.CPUUsageOverTime.forEach(series => {
          //         chart.data.datasets[index].data.push({
          //           x: series.time,
          //           y: series.value,
          //         });
          //       });

          //       console.log('For each loop end data ', chart.data.datasets[index])
          //     });

          //     console.log('check to see if new value added to array:', chart.data.datasets)
          //   };
          //   chart.update('quiet');
          // })
        },
      }
    },
    scales: {
      x: {
        type: 'realtime',
        // realtime: {
        //   duration: 60 * 10000,
        //   delay: 60 * 1000,
        //   refresh: 60 * 1000,
        //   ttl: 20 * 60 * 1000,
        //   onRefresh: (chart) => {
        //     const queryVariables = {
        //       start: now.current.toString(),
        //       end: new Date().toString(),
        //       step: '60s',
        //     };
        //     now.current = new Date(queryVariables.end);
        //     // console.log('chart dataset before refetch', chart.data.datasets);
        //     refetch({...queryVariables}).then((queryResult) => {

        //       if (!loading) {
        //         console.log('Refetched data: ', queryResult);

        //         console.log('Before refetch data2: ', chart.data.datasets)
        //         queryResult.data.brokers.forEach((broker, index) => {
        //           console.log('For each loop start data ', chart.data.datasets[index].data);

        //           broker.CPUUsageOverTime.forEach(series => {
        //             console.log(series)
        //             chart.data.datasets[index].data.push({
        //               x: series.time,
        //               y: series.value,
        //             });
        //           });

        //           console.log('For each loop end data ', chart.data.datasets[index].data)
        //         });

        //         console.log('check to see if new value added to array:', chart.data.datasets)
        //       };
        //       chart.update('quiet');
        //     })
        //   },
        // },
        time: {
          unit: "minute",
          parser: (label: string) => new Date(label).getTime(),
          stepSize: 1.0,
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
          autoSkip: false,
          maxRotation: 45,
          minRotation: 45,
        },
      },
      y: {
        min: 0,
        max: 100,
        title: {
          display: true,
          text: 'CPU Usage'
        },
      }
    },
  };

  // console.log(chartData);
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
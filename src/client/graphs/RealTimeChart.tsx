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
import { ModeComment } from '@mui/icons-material';

const RealTimeChart = () => {

  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

  const colors = ["#003f5c", "#bc5090", "#ffa600", "#58508d", "#2a71d0"];

  //Get current time/date for end paramter of Broker CPU query
  const now = useRef(new Date());
  const loaded = useRef(false);
  const chartRef = useRef(null);



  const options = {
    responsive: true,
    //feed time stamp to x axis, value to y
    parsing: {
      xAxisKey: "time",
      yAxisKey: "value",
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
        // onRefresh: (chart) => {
        //   const variables = {
        //     start: now.current.toString(),
        //     end: new Date().toString(),
        //     step: step,
        //   };
        //   timeNow.current = new Date(variables.end);
        //   refetch({ ...variables }).then((result) => {
        //     if (loaded.current) {
        //       result.data[resource].forEach((series, index) => {
        //         series[`${metric}`].forEach((point) => {
        //           chart.data.datasets[index].data.push(point);
        //         });
        //       });
        //       console.log('Refteched data:', chart.data.datasets, 'Refetched labels:', chart.data.labels);
        //     }

        //     chart.update("quiet");
        //   });
        // },
      },
    },
    scales: {
      xAxes: {
        type: "realtime",
        realtime: {
          // onRefresh: chart => {
          //     chart.data.datasets.forEach(dataset => {
          //         dataset.data.push({
          //             "time": moment(),
          //             "value": Math.random() * 99
          //         });
          //     });
          // }
            onRefresh: (chart) => {
              const queryVariables = {
                start: now.current.toString(),
                end: new Date().toString(),
                step: '30s',
              };
              now.current = new Date(queryVariables.end);
              // console.log('chart dataset before refetch', chart.data.datasets);
              refetch({...queryVariables})
                .then(queryResult => {
                  if (loaded.current) {
                    queryResult.data.brokers.forEach((broker, index) => {
                      // console.log('For each loop start data ', chart.data.datasets[index]);
                      broker.CPUUsageOverTime.forEach(series => {
                        chart.data.datasets[index].data.push({
                          'time': series.time,
                          'value': series.value,
                        });
                      });
                      chart.update('quiet');
                      console.log('For each loop end data ', chart.data.datasets[index])
                    });
                  }

                });
        },
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
          // maxRotation: 45,
          // minRotation: 45,
        },
      },
    },
      yAxes: {
        stacked: true,
        min: 0,
        max: 100,
        title: {
          display: true,
          text: 'CPU Usage'
        },
      },
    },
  };

  //GraphQL query to the backend
  const { loading, data, refetch } = useQuery(BROKERS_CPU_USAGE, {
    variables: {
      start: new Date(now.current.valueOf() - 10 * 60000 * 2).toString(),
      end: now.current.toString(),
      step: '30s',
    },
    fetchPolicy: "network-only",
    nextFetchPolicy: "network-only",
    notifyOnNetworkStatusChange: true,
   });

  useEffect(() => {
    //make sure initial page load done
    if (loading || loaded.current) return;
    // const labels = data.brokers[0].CPUUsageOverTime[0].values.map(series => series.time);
    const labels = [];
    const datasets = [];

    data.brokers.forEach((broker, index) => {
      // const dataPH = [];
      // broker.CPUUsageOverTime.forEach( metric => dataPH.push(metric.value));
      // console.log('data series placeholder:', dataPH)
      const dataSet = {
        label: `Broker ${broker.id}`,
        backgroundColor: `${colors[index]}`,
        borderColor: `${colors[index]}`,
        pointRadius: 0,
        tension: 0.5,
        showLine: true,
        data: broker.CPUUsageOverTime.map(series => series = {'time': series.time, 'value': series.value})
        // data: dataPH
      };
      // console.log('Use Effect Data: ', dataSet, 'useEffect loading:', loading)
      // console.log('Datasets before pushing:', datasets);
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
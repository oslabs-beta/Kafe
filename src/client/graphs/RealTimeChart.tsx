// @ts-nocheck
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import { useQuery } from "@apollo/client";
import ChartStreaming from "chartjs-plugin-streaming";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { useTheme } from '@mui/material/styles';
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

const RealTimeChart = ({ query, metric, resources, yLabel, title, step, labelName, labelId }) => {
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
  ChartJS.unregister(ChartDataLabels);
  
  const theme = useTheme();
  const  { palette } = theme;
  console.log('Chart palette: ', palette.primary.dark);

  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

  //Colors are hard coded -- refactor to use MUI definitions
  const colors = ["#71ABC5", "#0F1031", "#ffa600", "#58508d", "#2a71d0"];

  //Get current time/date for end parameter of Broker CPU query
  const now = useRef(Date.now());
  const loaded = useRef(false);
  const chartRef = useRef(null);
  const skip = useRef(false);
  
  const options = {
    responsive: true,
    elements: {
      line: {
        tension: 0.5,
      },
    },
    plugins: {
      title: {
        display: title ? true : false,
        text: title,
        color: palette.mode !== 'light' ? 'white' : palette.primary.main,
      },
      streaming: {
        duration: 5 * 60000,
        delay: 30 * 1000,
        refresh: 30 * 1000,
        onRefresh: (chart) => {
          if (!chartRef.current) {
            chart.stop();
            chart.destroy();
            return;
          };

          const variables = {
            start: now.current.toString(),
            end: new Date().toString(),
            step: step ? step : '60s'
          };
          now.current = new Date(variables.end);

          refetch({ ...variables })
            .then(result => {

              if (loaded.current) {
                result.data[resources].forEach((resource, index) => {
                  resource[metric].forEach(series => chart.data.datasets[index].data.push({
                    'x': series.time,
                    'y': series.value,
                  }))
                })
              };

              chart.update('quiet')
            })
            .catch(err => console.log(err));
        },
      },
    },
    scales: {
      x: {
        type: "realtime",
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
      y: {
        title: {
          display: true,
          text: yLabel,
          color: palette.mode === 'dark' ? palette.primary.light : palette.primary.main,
        },
      },
    },
  }

  // GraphQL query to the backend
  const { loading, data, refetch } = useQuery(query, {
    variables: {
      start: new Date(Date.now() - 60000 * 10).toString(),
      end: new Date().toString(),
      step: step ? step : '60s',
    },
    fetchPolicy: "network-only",
    nextFetchPolicy: "network-only",
    notifyOnNetworkStatusChange: true,
    skip: skip.current,
  });
  

  useEffect(() => {
    console.log(`${yLabel} useEffect running...`)
    if (loading || loaded.current) return;

    const labels = [];
    const datasets = [];

    data[resources].forEach((resource, index) => {

      const dataSet = {
        label: `${labelName}: ${resource[labelId]}`,
        backgroundColor: `${colors[index]}`,
        borderColor: `${colors[index]}`,
        pointRadius: 0,
        tension: 0.5,
        showLine: true,
        data: resource[metric].map(series => series = {'x': series.time, 'y': series.value})
      };

      datasets.push(dataSet);
    });

    setChartData({ labels, datasets });

    return () => {
      loaded.current = true;
    };
  }, [loading]);

  useEffect(() => {
    loaded.current = false;
    skip.current = false;

    return () => {
      chartRef.current.stop();
      chartRef.current.destroy();
      skip.current = true;
    };

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
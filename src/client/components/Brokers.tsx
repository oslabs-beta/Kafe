import React from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider, gql } from '@apollo/client';
import { useQuery } from "@apollo/client";
import { Chart as ChartJS, CategoryScale } from 'chart.js/auto';
ChartJS.register(CategoryScale);
import BarChart from './BarChart';

const brokerQuery =   gql`
query GetCluster {
  cluster {
    brokers {
      id
      host
      port
    }
  }
}
`

const chartData = [{host: "localhost",id:2,port: 9092,__typename: "Broker"},{host: "localhost",id:1,port: 9091,__typename: "Broker"},{host: "localhost",id:3,port: 9093,__typename: "Broker"}];

function Brokers(){
    const { data } = useQuery(brokerQuery, {
        pollInterval: 1000000,
       });
        console.log(data)

return(
    <>
        <div>Brokers</div>
        <BarChart />
    </>
    );
}

export default Brokers;
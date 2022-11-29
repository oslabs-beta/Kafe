import React from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider, gql } from '@apollo/client';
import { useQuery } from "@apollo/client";
import { Chart as ChartJS } from 'chart.js/auto';
import BarChart from './BarChart';

function Brokers(){
    // const { data } = useQuery(brokerQuery, {
    //     pollInterval: 1000000,
    //    });
    //     console.log(data)

return(
    <>
        <div>Brokers</div>
        <BarChart />
    </>
    );
}

export default Brokers;
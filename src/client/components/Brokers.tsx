import React from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider, gql } from '@apollo/client';
import { useQuery } from "@apollo/client";
import { Chart as ChartJS, CategoryScale } from 'chart.js/auto';
ChartJS.register(CategoryScale);
import BarChart from '../graphs/BarChart';
import RealTimeChart from '../graphs/RealTimeChart';

function Brokers(){

    return(
            <>
                <div>Brokers</div>
            </>
    );
}

export default Brokers;
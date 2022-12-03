import React from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider, gql } from '@apollo/client';
import { useQuery } from "@apollo/client";

import RealTimeChart from '../graphs/RealTimeChart';

import { BROKER_ALL_TOTALTIMEMS } from '../queries/graphQL';

function Brokers(){

    return(
        <>
            <div>Brokers</div>
        </>
    );
}

export default Brokers;
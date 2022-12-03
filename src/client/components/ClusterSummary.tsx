import React from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider, gql } from '@apollo/client';
import { useQuery } from "@apollo/client";

import RealTimeChart from '../graphs/RealTimeChart';
import { BROKERS_CPU_USAGE, BROKER_JVM_MEMORY_USAGE } from '../queries/graphQL';


const ClusterSummary = () => {
    return (
        <>
            <h4>Cluster Overview</h4>
            <div>
              <RealTimeChart
                query={ BROKERS_CPU_USAGE }
                metric = {'CPUUsageOverTime'}
                resources = {'brokers'}
                yLabel={'CPU Usage'}
                title={'CPU Usage Over Time'}
                step={'30s'}
                labelName={'Broker'}
                labelId={'id'}/>
              <RealTimeChart
                query = {BROKER_JVM_MEMORY_USAGE}
                metric = {'JVMMemoryUsedOverTime'}
                resources = {'brokers'}
                yLabel={'Memory Usage'}
                title = {'JVM Memory Usage Over Time'}
                step={'30s'}
                labelName={'Broker'}
                labelId={'id'}/>
            </div>
        </>
    )
};

export default ClusterSummary;
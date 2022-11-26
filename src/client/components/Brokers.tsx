import React from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider, gql } from '@apollo/client';
import { useQuery } from "@apollo/client";

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

function Brokers(){
    const { data } = useQuery(brokerQuery, {
        pollInterval: 30000,
       });
        console.log(data)

return(
    <div>Brokers</div>
    
    );
}

export default Brokers;
import React from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider, gql } from '@apollo/client';
import { useQuery } from "@apollo/client";

const consumerQuery =   gql`
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

function Consumers(){

return(
    <div>Consumers</div>
    );
}

export default Consumers;
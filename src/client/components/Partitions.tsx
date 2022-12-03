import React from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider, gql } from '@apollo/client';
import { useQuery } from "@apollo/client";

const partitionQuery =   gql`
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

function Partitions(){

return(
    <div>Partitions</div>
    );
}

export default Partitions;
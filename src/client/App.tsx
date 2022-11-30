import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ApolloClient, InMemoryCache, ApolloProvider, gql } from '@apollo/client';
import Dashboard from './containers/Dashboard';
import Main from './containers/Main';
import Brokers from './components/Brokers';
import Producers from './components/Producers';
import Consumers from './components/Consumers';
import Topics from './components/Topics';
import Partitions from './components/Partitions';
import { useQuery } from "@apollo/client"


  const testQuery =   gql`
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

const App = () => {
   const { loading, data } = useQuery(testQuery, {
    pollInterval: 30000,
   });
    
    return (
        <BrowserRouter>
        <Routes>
        <Route path="/" element={<Dashboard />}>
          <Route index element={<Main />}></Route>
          <Route path="brokers" element={<Brokers />}></Route>
          <Route path="producers" element={<Producers />}></Route>
          <Route path="consumers" element={<Consumers />}></Route>
          <Route path="Topics" element={<Topics />}></Route>
          <Route path="Partitions" element={<Partitions />}></Route>
        </Route>
      </Routes>
        </BrowserRouter>
    )
};

export default App;
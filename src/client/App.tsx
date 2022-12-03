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
import ClusterSummary from './components/ClusterSummary';
import { useQuery } from "@apollo/client"


const App = () => {

    return (
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Dashboard />}>
              <Route index element={<Main />}></Route>
              <Route path="overview" element={<ClusterSummary/>}></Route>
              <Route path="brokers" element={<Brokers />}></Route>
              <Route path="producers" element={<Producers />}></Route>
              <Route path="consumers" element={<Consumers />}></Route>
              <Route path="topics" element={<Topics />}></Route>
              <Route path="partitions" element={<Partitions />}></Route>
            </Route>
          </Routes>
        </BrowserRouter>
    )
};

export default App;
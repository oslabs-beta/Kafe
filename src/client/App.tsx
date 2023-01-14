import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './containers/Dashboard';
import Main from './containers/Main';
import Brokers from './components/Brokers';
import Consumers from './components/Consumers';
import ListTopics from './components/ListTopics';
import CreateTopic from './components/CreateTopic';
import DeleteTopic from './components/DeleteTopic';
import Partitions from './components/Partitions';
import ClusterSummary from './components/ClusterSummary';
import DLQ from './components/DLQ';
import { useQuery } from "@apollo/client"


const App = () => {
  //  Refactor based on final UI decisions and make DRY; see Studify for examples; consider conditional rendering of buttons based on confirmed connection to brokers

    return (
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Dashboard />}>
              <Route index element={<Main />}></Route>
              <Route path="overview" element={<ClusterSummary/>}></Route>
              <Route path="brokers" element={<Brokers />}></Route>
              <Route path="consumers" element={<Consumers />}></Route>
              <Route path="listtopics" element={<ListTopics />}></Route>
              <Route path="createtopic" element={<CreateTopic />}></Route>
              <Route path="deletetopic" element={<DeleteTopic />}></Route>
              <Route path="partitions" element={<Partitions />}></Route>
              <Route path="dlq" element={<DLQ />}></Route>
            </Route>
          </Routes>
        </BrowserRouter>
    )
};

export default App;
import React, {Suspense} from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './containers/Dashboard';
import TopicRecordDelete from './components/TopicRecordDelete';
const KafkaTree = React.lazy(() => import('./components/Tree'));
const ClusterSummary = React.lazy(() => import('./components/ClusterSummary'));
const Brokers = React.lazy(() => import('./components/Brokers'));
const Consumers = React.lazy(() => import('./components/Consumers'));
// const ListTopics = React.lazy(() => import('./components/ListTopics'));
const CreateTopic = React.lazy(() => import('./components/CreateTopic'));
const DeleteTopic = React.lazy(() => import('./components/DeleteTopic'));
const Partitions = React.lazy(() => import('./components/Partitions'));
const TopicManager = React.lazy(() => import('./components/TopicManager'));
const DLQ = React.lazy(() => import('./components/DLQ'));



const App = () => {
  //  Refactor based on final UI decisions and make DRY; see Studify for examples; consider conditional rendering of buttons based on confirmed connection to brokers

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Dashboard />}>
                <Route
                  path="overview"
                  element={<Suspense fallback={<div>Loading...</div>}><KafkaTree/></Suspense>}>
                </Route>
                <Route
                  path="summary"
                  element={<Suspense fallback={<div>Loading...</div>}><ClusterSummary/></Suspense>}>
                </Route>
                <Route
                  path="brokers"
                  element={<Suspense fallback={<div>Loading...</div>}><Brokers/></Suspense>}>
                </Route>
                <Route
                  path="consumers"
                  element={<Suspense fallback={<div>Loading...</div>}><Consumers/></Suspense>}>
                </Route>
                {/* <Route
                  path="listtopics"
                  element={<Suspense fallback={<div>Loading...</div>}><ListTopics/></Suspense>}>
                </Route> */}
                <Route
                  path="clustermanager"
                  element={<Suspense fallback={<div>Loading...</div>}><TopicManager/></Suspense>}>
                </Route>
                <Route path="createtopic" element={<CreateTopic />}></Route>
                <Route path="deletetopic" element={<DeleteTopic />}></Route>
                <Route
                  path="partitions"
                  element={<Suspense fallback={<div>Loading...</div>}><Partitions/></Suspense>}></Route>
                <Route
                  path="dlq"
                  element={<Suspense fallback={<div>Loading...</div>}><DLQ/></Suspense>}>
                </Route>
              </Route>
            </Routes>
        </BrowserRouter>
    )
};

export default App;
import React, {Suspense} from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './containers/Dashboard';

const KafkaTree = React.lazy(() => import('./components/Tree'));
const ClusterSummary = React.lazy(() => import('./components/ClusterSummary'));
const Brokers = React.lazy(() => import('./components/Brokers'));
const TopicManager = React.lazy(() => import('./components/TopicManager'));
const DLQ = React.lazy(() => import('./components/DLQ'));

const App = ({ toggleTheme }) => {

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Dashboard toggleTheme={toggleTheme}/>}>
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
                  path="clustermanager"
                  element={<Suspense fallback={<div>Loading...</div>}><TopicManager/></Suspense>}>
                </Route>
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
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ApolloClient, InMemoryCache, ApolloProvider, gql } from '@apollo/client';
import Dashboard from './containers/Dashboard';


const App = () => {
    return (
        <BrowserRouter>
                    <Dashboard />
        </BrowserRouter>
    )
};

export default App;
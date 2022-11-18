import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from './containers/Dashboard';

const App = () => {
    return (
        <BrowserRouter>
            <>
                <div>
                    Kafe PandaWhale
                </div>
                <div>
                    <Dashboard />
                </div>
            </>
        </BrowserRouter>
    )
};

export default App;
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import logger from 'redux-logger';
import { init } from './store';
import App from './App';
import getBaseName from './Utilities/getBaseName';

const CommitTracker = () => (
    <Provider store={ init(logger).getStore() }>
        <Router basename={ getBaseName(window.location.pathname) }>
            <App />
        </Router>
    </Provider>
);

export default CommitTracker;

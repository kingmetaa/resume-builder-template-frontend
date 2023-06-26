import React, { lazy, Suspense } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';

import Loader from './components/loader/Loader';
import './i18next';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';

const App = lazy(() => import(/* webpackChunkName: "app-context" */ './App'));
const client = new ApolloClient({
    uri: 'http://localhost:8000/graphql',
    cache: new InMemoryCache(),
});

ReactDOM.render(
    <Router>
        <Suspense fallback={<Loader />}>
            <ApolloProvider client={client}>
                <App />
            </ApolloProvider>
        </Suspense>
    </Router>,
    document.getElementById('root')
);

import React from 'react';
import ReactDOM from 'react-dom';
import './styles/index.css';
import App from './components/App';
import registerServiceWorker from './registerServiceWorker';
import { ApolloProvider, createNetworkInterface, ApolloClient } from 'react-apollo'
import { SubscriptionClient, addGraphQLSubscriptions } from 'subscriptions-transport-ws'
import { AUTH_TOKEN } from './constants'
import { BrowserRouter } from 'react-router-dom'

const networkInterface = createNetworkInterface({
    uri: process.env.REACT_APP_API_ENDPOINT
})

networkInterface.use([{
    applyMiddleware(req, next) {
        req.options.headers = req.options.headers || {}
        // get the authentication token from local storage if it exists
        // All queries and mutations are authenticated in server, so we need at least some token
        // Thats why I use a default token. (Didn't want other people messing around with data)
        const token = localStorage.getItem(AUTH_TOKEN) || process.env.REACT_APP_JWT_ACCESS_TOKEN;
        req.options.headers.Authorization = token ? `JWT ${token}` : null;
        next();
    }
}])

const wsClient = new SubscriptionClient(process.env.REACT_APP_SUBSCRIPTION_API_ENDPOINT, {
    reconnect: true,
    connectionParams: {
        uthToken: localStorage.getItem(AUTH_TOKEN),
    }
})

const networkInterfaceWithSubscriptions = addGraphQLSubscriptions(
    networkInterface,
    wsClient
)

const client = new ApolloClient({
    networkInterface: networkInterfaceWithSubscriptions
})

ReactDOM.render(
    <BrowserRouter>
        <ApolloProvider client={client}>
            <App />
        </ApolloProvider>
    </BrowserRouter>,
    document.getElementById('root')
)
registerServiceWorker();

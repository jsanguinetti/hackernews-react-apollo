import React from 'react';
import ReactDOM from 'react-dom';
import './styles/index.css';
import App from './components/App';
import registerServiceWorker from './registerServiceWorker';
import { ApolloProvider, createNetworkInterface, ApolloClient } from 'react-apollo'

const networkInterface = createNetworkInterface({
    uri: process.env.REACT_APP_API_ENDPOINT
})

networkInterface.use([{
    applyMiddleware(req, next) {
        if (!req.options.headers) {
            req.options.headers = {};  // Create the header object if needed.
        }
        // get the authentication token from local storage if it exists
        const token = process.env.REACT_APP_JWT_ACCESS_TOKEN;
        req.options.headers.authorization = token ? `JWT ${token}` : null;
        next();
    }
}])

const client = new ApolloClient({
    networkInterface
})

ReactDOM.render(
    <ApolloProvider client={client}>
        <App />
    </ApolloProvider>, 
    document.getElementById('root')
)
registerServiceWorker();

import ApolloClient from 'apollo-boost';
import React from 'react';
import { ApolloProvider } from 'react-apollo';
import Routes from './routes';

const client = new ApolloClient({
  uri: 'http://localhost:4000',
});

export default () => (
  <ApolloProvider client={client}>
    <Routes />
  </ApolloProvider>
);

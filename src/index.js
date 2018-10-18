import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloClient } from 'apollo-client';
import { createUploadLink } from 'apollo-upload-client';
import React from 'react';
import { ApolloProvider } from 'react-apollo';
import Routes from './routes';

const client = new ApolloClient({
  link: createUploadLink({ uri: 'http://localhost:4000' }),
  cache: new InMemoryCache(),
});

export default () => (
  <ApolloProvider client={client}>
    <Routes />
  </ApolloProvider>
);

import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloClient } from 'apollo-client';
import { split } from 'apollo-link';
import { setContext } from 'apollo-link-context';
import { WebSocketLink } from 'apollo-link-ws';
import { createUploadLink } from 'apollo-upload-client';
import { getMainDefinition } from 'apollo-utilities';
import React from 'react';
import { ApolloProvider } from 'react-apollo';
import { AsyncStorage } from 'react-native';
import { TOKEN_KEY } from './constants';
import Routes from './routes';

const wsLink = new WebSocketLink({
  uri: 'ws://localhost:4000/',
  options: {
    reconnect: true,
  },
});

const authLink = setContext(async (_, { headers }) => {
  const token = await AsyncStorage.getItem(TOKEN_KEY);
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const link = split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);
    return kind === 'OperationDefinition' && operation === 'subscription';
  },
  wsLink,
  authLink.concat(createUploadLink({ uri: 'http://localhost:4000' })),
);

const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
});

export default () => (
  <ApolloProvider client={client}>
    <Routes />
  </ApolloProvider>
);

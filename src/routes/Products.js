import gql from 'graphql-tag';
import React from 'react';
import { Query } from 'react-apollo';
import {
  Button, FlatList, Text, View,
} from 'react-native';

const productsQuery = gql`
  query {
    products {
      id
      name
      price
      pictureUrl
    }
  }
`;

export default ({ history }) => (
  <Query query={productsQuery}>
    {({ loading, error, data: { products } }) => {
      if (loading) return 'Loading...';
      if (error) return `Error! ${error.message}`;
      return (
        <View>
          <Text style={{ marginLeft: 50, marginTop: 50 }}>Products</Text>
          <FlatList
            data={products.map(p => ({ ...p, key: p.id }))}
            renderItem={({ item }) => (
              <View>
                <Text>
Item:
                  {item.name}
                </Text>
                <Text>
Price: $
                  {item.price}
                </Text>
              </View>
            )}
          />
          <Button title="Create new product" onPress={() => history.push('/new-product')} />
        </View>
      );
    }}
  </Query>
);

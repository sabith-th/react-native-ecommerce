import gql from 'graphql-tag';
import React from 'react';
import { Query } from 'react-apollo';
import {
  Button, FlatList, Image, StyleSheet, Text, View,
} from 'react-native';

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
  },
  images: {
    height: 100,
    width: 100,
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    margin: 10,
  },
  right: {
    flex: 1,
    marginLeft: 10,
    marginRight: 30,
    display: 'flex',
    alignItems: 'flex-end',
  },
  name: {
    fontWeight: 'bold',
    fontSize: 30,
  },
  price: {
    fontSize: 20,
    fontStyle: 'italic',
  },
});

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
        <View style={styles.container}>
          <FlatList
            data={products.map(p => ({ ...p, key: p.id }))}
            renderItem={({ item }) => (
              <View style={styles.row}>
                <Image
                  style={styles.images}
                  source={{ uri: `http://localhost:4000/${item.pictureUrl}` }}
                />
                <View style={styles.right}>
                  <Text style={styles.name}>{item.name}</Text>
                  <Text style={styles.price}>{`$${item.price}`}</Text>
                </View>
              </View>
            )}
          />
          <Button title="Create new product" onPress={() => history.push('/new-product')} />
        </View>
      );
    }}
  </Query>
);

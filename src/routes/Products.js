import gql from 'graphql-tag';
import jwtDecode from 'jwt-decode';
import React from 'react';
import { Mutation, Query } from 'react-apollo';
import {
  AsyncStorage, Button, FlatList, Image, StyleSheet, Text, View,
} from 'react-native';
import { TOKEN_KEY } from '../constants';

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
  editSection: {
    display: 'flex',
    flexDirection: 'row',
  },
});

export const productsQuery = gql`
  query {
    products {
      id
      name
      price
      pictureUrl
      seller {
        id
      }
    }
  }
`;

export const deleteProductMutation = gql`
  mutation DeleteProduct($id: ID!) {
    deleteProduct(where: { id: $id }) {
      id
    }
  }
`;

export default class Products extends React.Component {
  state = {
    userId: null,
  };

  componentDidMount = async () => {
    const token = await AsyncStorage.getItem(TOKEN_KEY);
    const { userId } = jwtDecode(token);
    this.setState({
      userId,
    });
  };

  render() {
    const { history } = this.props;
    const { userId } = this.state;
    return (
      <Mutation mutation={deleteProductMutation}>
        {deleteProduct => (
          <Query query={productsQuery}>
            {({ loading, error, data: { products } }) => {
              if (loading) return 'Loading...';
              if (error) return `Error! ${error.message}`;
              return (
                <View style={styles.container}>
                  <Button title="Create new product" onPress={() => history.push('/new-product')} />
                  <FlatList
                    keyExtractor={item => item.id}
                    data={products}
                    renderItem={({ item }) => (
                      <View style={styles.row}>
                        <Image
                          style={styles.images}
                          source={{ uri: `http://localhost:4000/${item.pictureUrl}` }}
                        />
                        <View style={styles.right}>
                          <Text style={styles.name}>{item.name}</Text>
                          <Text style={styles.price}>{`$${item.price}`}</Text>
                          {userId === item.seller.id && (
                            <View style={styles.editSection}>
                              <Button title="Edit" onPress={() => {}} />
                              <Button
                                title="Delete"
                                onPress={() => {
                                  deleteProduct({
                                    variables: { id: item.id },
                                    update: (store) => {
                                      const data = store.readQuery({ query: productsQuery });
                                      data.products = data.products.filter(x => x.id !== item.id);
                                      store.writeQuery({ query: productsQuery, data });
                                    },
                                  });
                                }}
                              />
                            </View>
                          )}
                        </View>
                      </View>
                    )}
                  />
                </View>
              );
            }}
          </Query>
        )}
      </Mutation>
    );
  }
}

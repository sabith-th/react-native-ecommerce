import gql from 'graphql-tag';
import jwtDecode from 'jwt-decode';
import React from 'react';
import { Mutation, Query } from 'react-apollo';
import {
  ActivityIndicator,
  AsyncStorage,
  Button,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { TOKEN_KEY } from '../constants';

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
    display: 'flex',
    flex: 1,
  },
  images: {
    height: 125,
    width: 125,
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    margin: 10,
    justifyContent: 'center',
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
  sortButton: {
    flex: 1,
  },
  searchBar: {
    padding: 10,
    margin: 10,
  },
});

export const productsQuery = gql`
  query($orderBy: ProductOrderByInput, $where: ProductWhereInput, $after: String) {
    productsConnection(first: 5, where: $where, orderBy: $orderBy, after: $after) {
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        node {
          id
          name
          price
          pictureUrl
          seller {
            id
          }
        }
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
    query: '',
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
    const { userId, query } = this.state;
    return (
      <Mutation mutation={deleteProductMutation}>
        {deleteProduct => (
          <Query query={productsQuery} variables={{ orderBy: 'createdAt_ASC' }} partialRefetch>
            {({
              loading, error, data: { productsConnection }, refetch, variables, fetchMore,
            }) => {
              if (loading) return <ActivityIndicator size="large" color="#0000ff" />;
              if (error) return `Error! ${error.message}`;
              const products = productsConnection.edges;
              const { hasNextPage } = productsConnection.pageInfo;
              return (
                <View style={styles.container}>
                  <View>
                    <View style={styles.searchBar}>
                      <TextInput
                        name="Search"
                        placeholder="Search"
                        value={query}
                        onChangeText={(text) => {
                          this.setState({ query: text });
                          refetch({
                            where: {
                              name_contains: text,
                            },
                          });
                        }}
                      />
                    </View>
                    <View style={styles.row}>
                      <Button
                        title="Name"
                        style={styles.sortButton}
                        onPress={() => refetch({
                          orderBy: variables.orderBy === 'name_ASC' ? 'name_DESC' : 'name_ASC',
                          after: null,
                        })
                        }
                      />
                      <Button
                        title="Price"
                        style={styles.sortButton}
                        onPress={() => refetch({
                          orderBy: variables.orderBy === 'price_ASC' ? 'price_DESC' : 'price_ASC',
                          after: null,
                        })
                        }
                      />
                    </View>
                  </View>
                  <Button
                    title="Create new product"
                    onPress={() => history.push({ pathname: '/new-product', state: variables })}
                  />
                  <FlatList
                    keyExtractor={item => item.id}
                    ListFooterComponent={() => hasNextPage && <ActivityIndicator size="large" color="#0000ff" />
                    }
                    onEndReached={() => {
                      if (!loading && hasNextPage) {
                        fetchMore({
                          variables: {
                            after: productsConnection.pageInfo.endCursor,
                          },
                          updateQuery: (prev, { fetchMoreResult }) => {
                            if (!fetchMoreResult) return prev;
                            return {
                              productsConnection: {
                                __typename: 'ProductConnection',
                                pageInfo: fetchMoreResult.productsConnection.pageInfo,
                                edges: [
                                  ...prev.productsConnection.edges,
                                  ...fetchMoreResult.productsConnection.edges,
                                ],
                              },
                            };
                          },
                        });
                      }
                    }}
                    onEndReachedThreshold={0}
                    data={products.map(p => ({
                      ...p.node,
                      showButtons: userId === p.node.seller.id,
                    }))}
                    renderItem={({ item }) => (
                      <View style={styles.row}>
                        <Image
                          style={styles.images}
                          source={{ uri: `http://localhost:4000/${item.pictureUrl}` }}
                        />
                        <View style={styles.right}>
                          <Text style={styles.name}>{item.name}</Text>
                          <Text style={styles.price}>{`$${item.price}`}</Text>
                          {item.showButtons && (
                            <View style={styles.editSection}>
                              <Button
                                title="Edit"
                                onPress={() => history.push({
                                  pathname: '/edit-product',
                                  state: {
                                    item,
                                    variables,
                                  },
                                })
                                }
                              />
                              <Button
                                title="Delete"
                                onPress={() => {
                                  deleteProduct({
                                    variables: { id: item.id },
                                    update: (store) => {
                                      const data = store.readQuery({
                                        query: productsQuery,
                                        variables,
                                      });
                                      const edges = data.productsConnection.edges.filter(
                                        x => x.node.id !== item.id,
                                      );
                                      data.productsConnection.edges = edges;
                                      store.writeQuery({ query: productsQuery, data, variables });
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

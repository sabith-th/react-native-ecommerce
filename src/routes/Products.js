import gql from 'graphql-tag';
import React from 'react';
import { Query } from 'react-apollo';
import {
  AsyncStorage, Button, FlatList, Image, StyleSheet, Text, View,
} from 'react-native';
import { USER_ID } from '../constants';

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

export default class Products extends React.Component {
  state = {
    userId: null,
  };

  componentDidMount = async () => {
    this.setState({
      userId: await AsyncStorage.getItem(USER_ID),
    });
  };

  render() {
    const { history } = this.props;
    const { userId } = this.state;
    return (
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
                          <Button title="Delete" onPress={() => {}} />
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
    );
  }
}

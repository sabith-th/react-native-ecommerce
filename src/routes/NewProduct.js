import { ReactNativeFile } from 'apollo-upload-client';
import gql from 'graphql-tag';
import React from 'react';
import { Mutation } from 'react-apollo';
import Form from '../components/Form';
import { productsQuery } from './Products';

const createProductMutation = gql`
  mutation CreateProduct($name: String!, $price: Float!, $picture: Upload!) {
    createProduct(name: $name, price: $price, picture: $picture) {
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

export default class NewProduct extends React.Component {
  onSubmit = async (mutate, values) => {
    const { pictureUrl, name, price } = values;
    const { history } = this.props;
    const picture = new ReactNativeFile({
      uri: pictureUrl,
      name: 'a.jpg',
      type: 'image/jpeg',
    });

    try {
      await mutate({
        variables: {
          name,
          price: parseFloat(price),
          picture,
        },
        update: (store, { data: { createProduct } }) => {
          const data = store.readQuery({ query: productsQuery });
          data.products.push(createProduct);
          store.writeQuery({ query: productsQuery, data });
        },
      });
    } catch (e) {
      // eslint-disable-next-line
      console.log(e);
      return;
    }
    history.push('/products');
  };

  render() {
    return (
      <Mutation mutation={createProductMutation}>
        {mutate => <Form submit={this.onSubmit} mutate={mutate} buttonText="Create Product" />}
      </Mutation>
    );
  }
}

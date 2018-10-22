import { ReactNativeFile } from 'apollo-upload-client';
import gql from 'graphql-tag';
import React from 'react';
import { Mutation } from 'react-apollo';
import Form from '../components/Form';
import { productsQuery } from './Products';

const updateProductMutation = gql`
  mutation UpdateProduct($id: ID!, $name: String, $price: Float, $picture: Upload) {
    updateProduct(id: $id, name: $name, price: $price, picture: $picture) {
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

export default class EditProduct extends React.Component {
  onSubmit = async (mutate, values) => {
    const { pictureUrl, name, price } = values;
    const {
      history,
      location: {
        state: { item, variables },
      },
    } = this.props;
    let picture = null;
    if (item.pictureUrl !== pictureUrl) {
      picture = new ReactNativeFile({
        uri: pictureUrl,
        name: 'a.jpg',
        type: 'image/jpeg',
      });
    }
    try {
      await mutate({
        variables: {
          id: item.id,
          name,
          price: parseFloat(price),
          picture,
        },
        update: (store, { data: { updateProduct } }) => {
          const data = store.readQuery({ query: productsQuery, variables });
          data.productsConnection.edges = data.productsConnection.edges.map(
            p => (p.node.id === updateProduct.id
              ? { __typename: 'Node', cursor: updateProduct.id, node: updateProduct }
              : p),
          );
          store.writeQuery({ query: productsQuery, data, variables });
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
    const {
      location: {
        state: { item },
      },
    } = this.props;
    return (
      <Mutation mutation={updateProductMutation}>
        {mutate => (
          <Form
            initialValues={{
              ...item,
              pictureUrl: `http://localhost:4000/${item.pictureUrl}`,
              price: `${item.price}`,
            }}
            submit={this.onSubmit}
            mutate={mutate}
            buttonText="Edit Product"
          />
        )}
      </Mutation>
    );
  }
}

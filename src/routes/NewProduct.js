import { ReactNativeFile } from 'apollo-upload-client';
import { ImagePicker } from 'expo';
import gql from 'graphql-tag';
import React from 'react';
import { Mutation } from 'react-apollo';
import { Button, Image, View } from 'react-native';
import TextField from '../components/TextField';

const createProductMutation = gql`
  mutation CreateProduct($name: String!, $price: Float!, $picture: Upload!) {
    createProduct(name: $name, price: $price, picture: $picture) {
      id
    }
  }
`;

const defaultState = {
  values: {
    name: '',
    price: '',
    pictureUrl: '',
  },
  errors: {},
  isSubmitting: false,
};

export default class NewProduct extends React.Component {
  state = defaultState;

  onChangeText = (key, value) => {
    this.setState(state => ({
      values: {
        ...state.values,
        [key]: value,
      },
    }));
  };

  onSubmit = async (mutate) => {
    const {
      isSubmitting,
      values: { pictureUrl, name, price },
    } = this.state;
    const { history } = this.props;
    const picture = new ReactNativeFile({
      uri: pictureUrl,
      name: 'a.jpg',
      type: 'image/jpeg',
    });

    if (isSubmitting) {
      return;
    }

    this.setState({ isSubmitting: true });
    try {
      await mutate({
        variables: {
          name,
          price: parseFloat(price),
          picture,
        },
      });
    } catch (e) {
      // eslint-disable-next-line
      console.log(e);
    }
    history.push('/products');
  };

  pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
    });

    if (!result.cancelled) {
      this.onChangeText('pictureUrl', result.uri);
    }
  };

  render() {
    const {
      values: { name, price, pictureUrl },
    } = this.state;
    return (
      <Mutation mutation={createProductMutation}>
        {mutate => (
          <View
            style={{
              flex: 1,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <View style={{ width: 200 }}>
              <TextField value={name} name="name" onChangeText={this.onChangeText} />
              <TextField value={price} name="price" onChangeText={this.onChangeText} />
              <Button title="Pick an image from camera roll" onPress={this.pickImage} />
              {pictureUrl && (
                <Image source={{ uri: pictureUrl }} style={{ width: 200, height: 200 }} />
              )}
              <Button title="Create Product" onPress={() => this.onSubmit(mutate)} />
            </View>
          </View>
        )}
      </Mutation>
    );
  }
}

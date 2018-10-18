import { ImagePicker } from 'expo';
import React from 'react';
import { Button, Image, View } from 'react-native';
import TextField from '../components/TextField';

const defaultState = {
  values: {
    name: '',
    price: '',
    pictureUrl: '',
    seller: '',
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
    const { isSubmitting, values } = this.state;
    const { history } = this.props;
    if (isSubmitting) {
      return;
    }
    this.setState({ isSubmitting: true });
    let response;
    try {
      response = await mutate({
        variables: values,
      });
    } catch (e) {
      // this.setState({
      //   errors: {
      //     email: 'Email already taken',
      //   },
      //   isSubmitting: false,
      // });
      // return;
    }
    console.log(response);
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
      values: {
        name, price, pictureUrl, seller,
      },
    } = this.state;
    return (
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
          <TextField value={seller} name="seller" onChangeText={this.onChangeText} />

          <Button title="Pick an image from camera roll" onPress={this.pickImage} />
          {pictureUrl && <Image source={{ uri: pictureUrl }} style={{ width: 200, height: 200 }} />}
          <Button
            title="Create Product"
            onPress={() => {
              console.log('hello there');
            }}
          />
        </View>
      </View>
    );
  }
}

import { ImagePicker } from 'expo';
import React from 'react';
import { Button, Image, View } from 'react-native';
import TextField from './TextField';

const defaultState = {
  values: {
    name: '',
    price: '',
    pictureUrl: '',
  },
  errors: {},
  isSubmitting: false,
};

export default class Form extends React.Component {
  constructor(props) {
    super(props);
    const { initialValues = {} } = props;
    this.state = {
      ...defaultState,
      values: {
        ...defaultState.values,
        ...initialValues,
      },
    };
  }

  onChangeText = (key, value) => {
    this.setState(state => ({
      values: {
        ...state.values,
        [key]: value,
      },
    }));
  };

  onSubmit = async () => {
    const { isSubmitting, values } = this.state;
    const { submit, mutate } = this.props;

    if (isSubmitting) {
      return;
    }

    submit(mutate, values);
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
    const { buttonText } = this.props;
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
          <Button title="Pick an image from camera roll" onPress={this.pickImage} />
          {pictureUrl && <Image source={{ uri: pictureUrl }} style={{ width: 200, height: 200 }} />}
          <Button title={buttonText} onPress={() => this.onSubmit()} />
        </View>
      </View>
    );
  }
}

import React from 'react';
import { TextInput, View } from 'react-native';

export default class Login extends React.Component {
  state = {
    values: {},
    errors: {},
    isSubmitting: false,
  };

  render() {
    return (
      <View style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
        <View>
          <TextInput placeholder="name" />
        </View>
      </View>
    );
  }
}

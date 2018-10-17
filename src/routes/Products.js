import React from 'react';
import { TextInput, View } from 'react-native';

export default class Products extends React.Component {
  state = {
    items: [{ 1: 'Car' }],
  };

  render() {
    const { items } = this.state;
    return (
      <View style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
        <View>
          <TextInput placeholder="name" />
          {items[0].toString()}
        </View>
      </View>
    );
  }
}

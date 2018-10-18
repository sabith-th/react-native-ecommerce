import React from 'react';
import { Text, TextInput, View } from 'react-native';

export default class Products extends React.Component {
  state = {
    items: ['Car', 'Bus'],
  };

  render() {
    const { items } = this.state;
    return (
      <View style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
        <View>
          <TextInput placeholder="name" />
          <Text>{`Products: ${items[0].toString()}`}</Text>
        </View>
      </View>
    );
  }
}

import React from 'react';
import { Button, Text, View } from 'react-native';

export default ({ history }) => (
  <View>
    <Text style={{ marginLeft: 50, marginTop: 50 }}>Products</Text>
    <Button title="Create new product" onPress={() => history.push('/new-product')} />
  </View>
);

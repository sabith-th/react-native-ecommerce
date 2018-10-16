import React from 'react';
import { StyleSheet, TextInput } from 'react-native';

const styles = StyleSheet.create({
  field: {
    borderBottomWidth: 1,
    fontSize: 20,
    marginBottom: 15,
    height: 35,
  },
});

export default class TextField extends React.PureComponent {
  onChangeText = (text) => {
    const { onChangeText, name } = this.props;
    onChangeText(name, text);
  };

  render() {
    const { value, name, secureTextEntry } = this.props;
    return (
      <TextInput
        value={value}
        onChangeText={this.onChangeText}
        placeholder={name}
        style={styles.field}
        autoCapitalize="none"
        secureTextEntry={!!secureTextEntry}
      />
    );
  }
}

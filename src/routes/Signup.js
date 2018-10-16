import gql from 'graphql-tag';
import React from 'react';
import { Mutation } from 'react-apollo';
import {
  Button, StyleSheet, TextInput, View,
} from 'react-native';

const signUpMutation = gql`
  mutation SignUp($email: String!, $password: String!, $name: String!) {
    signup(email: $email, password: $password, name: $name) {
      token
    }
  }
`;

const styles = StyleSheet.create({
  field: {
    borderBottomWidth: 1,
    fontSize: 20,
    marginBottom: 15,
    height: 35,
  },
});

export default class Signup extends React.Component {
  state = {
    values: {
      name: '',
      email: '',
      password: '',
    },
    // errors: {},
    isSubmitting: false,
  };

  onChangeText = (key, value) => {
    this.setState(state => ({
      values: {
        ...state.values,
        [key]: value,
      },
    }));
  };

  render() {
    const {
      values: { name, email, password },
      isSubmitting,
    } = this.state;
    const { values } = this.state;
    return (
      <Mutation mutation={signUpMutation}>
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
              <TextInput
                value={name}
                onChangeText={text => this.onChangeText('name', text)}
                placeholder="name"
                style={styles.field}
              />
              <TextInput
                value={email}
                onChangeText={text => this.onChangeText('email', text)}
                placeholder="email"
                style={styles.field}
              />
              <TextInput
                value={password}
                onChangeText={text => this.onChangeText('password', text)}
                placeholder="password"
                style={styles.field}
                secureTextEntry
              />
              <Button
                title="Create Account"
                onPress={async (e) => {
                  e.preventDefault();
                  if (isSubmitting) {
                    return;
                  }
                  this.setState({ isSubmitting: true });
                  await mutate({
                    variables: values,
                  });
                  this.setState({ isSubmitting: false });
                }}
              />
            </View>
          </View>
        )}
      </Mutation>
    );
  }
}

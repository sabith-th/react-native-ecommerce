import gql from 'graphql-tag';
import React from 'react';
import { Mutation } from 'react-apollo';
import {
  AsyncStorage, Button, Text, View,
} from 'react-native';
import TextField from '../components/TextField';

const loginMutation = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      payload {
        token
      }
      error {
        field
        message
      }
    }
  }
`;

const defaultState = {
  values: {
    email: '',
    password: '',
  },
  errors: {},
  isSubmitting: false,
};

export default class Login extends React.Component {
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
    const response = await mutate({
      variables: values,
    });
    const { payload, error } = response.data.login;
    if (payload) {
      await AsyncStorage.setItem('@ecommerce/token', payload.token);
      history.push('/products');
    } else {
      this.setState({
        errors: {
          [error.field]: [error.message],
        },
        isSubmitting: false,
      });
    }
  };

  goToSignupPage = () => {
    const { history } = this.props;
    history.push('/signup');
  };

  render() {
    const {
      values: { email, password },
      errors,
    } = this.state;
    return (
      <Mutation mutation={loginMutation}>
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
              <TextField value={email} name="email" onChangeText={this.onChangeText} />
              {errors.email && <Text style={{ color: 'red' }}>{errors.email}</Text>}
              <TextField
                value={password}
                name="password"
                secureTextEntry
                onChangeText={this.onChangeText}
              />
              {errors.password && <Text style={{ color: 'red' }}>{errors.password}</Text>}
              <Button title="Login" onPress={() => this.onSubmit(mutate)} />
              <Text style={{ textAlign: 'center' }}>or</Text>
              <Button title="Create Account" onPress={this.goToSignupPage} />
            </View>
          </View>
        )}
      </Mutation>
    );
  }
}

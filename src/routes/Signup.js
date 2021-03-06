import gql from 'graphql-tag';
import React from 'react';
import { Mutation } from 'react-apollo';
import {
  AsyncStorage, Button, Text, View,
} from 'react-native';
import TextField from '../components/TextField';
import { TOKEN_KEY } from '../constants';

const signUpMutation = gql`
  mutation SignUp($email: String!, $password: String!, $name: String!) {
    signup(email: $email, password: $password, name: $name) {
      token
    }
  }
`;

const defaultState = {
  values: {
    name: '',
    email: '',
    password: '',
  },
  errors: {},
  isSubmitting: false,
};

export default class Signup extends React.Component {
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
      this.setState({
        errors: {
          email: 'Email already taken',
        },
        isSubmitting: false,
      });
      return;
    }
    await AsyncStorage.setItem(TOKEN_KEY, response.data.signup.token);
    history.push('/products');
  };

  goToLoginPage = () => {
    const { history } = this.props;
    history.push('/login');
  };

  render() {
    const {
      values: { name, email, password },
      errors,
    } = this.state;
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
              <TextField value={name} name="name" onChangeText={this.onChangeText} />
              <TextField value={email} name="email" onChangeText={this.onChangeText} />
              {errors.email && <Text style={{ color: 'red' }}>{errors.email}</Text>}
              <TextField
                value={password}
                name="password"
                secureTextEntry
                onChangeText={this.onChangeText}
              />
              <Button title="Create Account" onPress={() => this.onSubmit(mutate)} />
              <Text style={{ textAlign: 'center' }}>or</Text>
              <Button title="Login" onPress={this.goToLoginPage} />
            </View>
          </View>
        )}
      </Mutation>
    );
  }
}

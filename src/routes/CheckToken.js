import gql from 'graphql-tag';
import React from 'react';
import { Mutation } from 'react-apollo';
import {
  ActivityIndicator, AsyncStorage, StyleSheet, View,
} from 'react-native';
import { TOKEN_KEY } from '../constants';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
});

const refreshTokenMutation = gql`
  mutation RefreshToken($token: String!) {
    refreshToken(token: $token)
  }
`;

class CheckToken extends React.Component {
  componentDidMount = async () => {
    const { checkToken, history } = this.props;
    const token = await AsyncStorage.getItem(TOKEN_KEY);
    if (!token) {
      history.push('/signup');
      return;
    }
    let response;
    try {
      response = await checkToken({ variables: { token } });
    } catch (e) {
      history.push('/signup');
      return;
    }
    const { refreshToken } = response.data;
    await AsyncStorage.setItem(TOKEN_KEY, refreshToken);
    history.push('/products');
  };

  render() {
    return (
      <View style={[styles.container, styles.horizontal]}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }
}

export default props => (
  <Mutation mutation={refreshTokenMutation}>
    {checkToken => <CheckToken checkToken={checkToken} history={props.history} />}
  </Mutation>
);

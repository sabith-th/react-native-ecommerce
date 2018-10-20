import gql from 'graphql-tag';
import React from 'react';
import { Mutation } from 'react-apollo';
import {
  ActivityIndicator, AsyncStorage, StyleSheet, View,
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { TOKEN_KEY } from '../constants';
import { addUser } from '../reducers/user';

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
  mutation RefreshToken {
    refreshToken {
      token
      userId
    }
  }
`;

class CheckToken extends React.Component {
  componentDidMount = async () => {
    const { checkToken, history, addUserAction } = this.props;
    const token = await AsyncStorage.getItem(TOKEN_KEY);
    if (!token) {
      history.push('/signup');
      return;
    }
    let response;
    try {
      response = await checkToken();
    } catch (e) {
      history.push('/signup');
      return;
    }
    const {
      refreshToken: { token: newToken, userId },
    } = response.data;
    await AsyncStorage.setItem(TOKEN_KEY, newToken);
    addUserAction({ userId });
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

const Home = props => (
  <Mutation mutation={refreshTokenMutation}>
    {checkToken => (
      <CheckToken
        checkToken={checkToken}
        history={props.history}
        addUserAction={props.addUserAction}
      />
    )}
  </Mutation>
);

export default connect(
  null,
  dispatch => bindActionCreators({ addUserAction: addUser }, dispatch),
)(Home);

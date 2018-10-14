import React from 'react';
import { NativeRouter, Route, Switch } from 'react-router-native';
import Login from './Login';
import Signup from './Signup';

export default () => (
  <NativeRouter>
    <Switch>
      <Route exact path="/" component={Signup} />
      <Route exact path="/login" component={Login} />
    </Switch>
  </NativeRouter>
);

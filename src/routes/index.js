import React from 'react';
import { NativeRouter, Route, Switch } from 'react-router-native';
import Login from './Login';
import Products from './Products';
import Signup from './Signup';

export default () => (
  <NativeRouter>
    <Switch>
      <Route exact path="/" component={Signup} />
      <Route exact path="/login" component={Login} />
      <Route exact path="/products" component={Products} />
    </Switch>
  </NativeRouter>
);

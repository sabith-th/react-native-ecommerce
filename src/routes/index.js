import React from 'react';
import { NativeRouter, Route, Switch } from 'react-router-native';
import Home from './CheckToken';
import Login from './Login';
import Products from './Products';
import Signup from './Signup';

export default () => (
  <NativeRouter>
    <Switch>
      <Route exact path="/" component={Home} />
      <Route exact path="/login" component={Login} />
      <Route exact path="/signup" component={Signup} />
      <Route exact path="/products" component={Products} />
    </Switch>
  </NativeRouter>
);

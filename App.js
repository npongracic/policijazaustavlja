/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View
} from 'react-native';

import {
  Router,
  Scene
} from 'react-native-router-flux';

import Map  from './components/Map';
import Home from './components/Home';


import styles from './styles';

export default class App extends Component<{}> {
  render() {
    return (

      <Router>
        <Scene key="root">
          <Scene key="home" component={Home} hideNavBar initial />
          <Scene key="map" component={Map} hideNavBar  />
        </Scene>
      </Router>
    );
  }
}

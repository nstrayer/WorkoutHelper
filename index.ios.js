'use strict';
//Import needed stuff here.
import React, { Component } from 'react';
import {
  NavigatorIOS,
  AppRegistry,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';

import AppNav from './AppNav';

//setup styles for this component here.
const styles = StyleSheet.create({
  container: {
    flex:1
  }
});

//component itself goes here.
class WorkoutLog extends Component {
  render() {
    return (
      <NavigatorIOS
        style = {styles.container}
        initialRoute={{
          title: 'Workout Log',
          component: AppNav,
        }}/>
    );
  }
}

AppRegistry.registerComponent('WorkoutLog', () => WorkoutLog);

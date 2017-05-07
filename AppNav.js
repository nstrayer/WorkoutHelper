'use strict';

import React, { Component } from 'react'
import {
    StyleSheet,
    Text,
    TextInput,
    View,
    TouchableHighlight,
    ActivityIndicator,
    Image
} from 'react-native';

import WarmupSets from './WarmupSets'
import WorkoutChoose from './WorkoutChoose'

const styles = StyleSheet.create({
    container:{
        padding: 30,
        marginTop: 65,
        alignItems: 'center'
    },
    flowRight: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'stretch'
    },
    buttonText: {
        fontSize: 18,
        color: 'white',
        alignSelf: 'center'
    },
    navButton: {
        height: 36,
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#48BBEC',
        borderColor: '#48BBEC',
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 10,
        alignSelf: 'stretch',
        justifyContent: 'center'
    },
    menuChoice: {
      flexDirection: 'row',
      padding: 10
    },
});

class AppNav extends Component{
  constructor(props){
    super(props);
    this.state = {
      logged_in: false
    };
  }

  goToWarmups(event){
    //logic for navigating around app.
    this.props.navigator.push({
      title: "Warmup Sets",
      component: WarmupSets,
      // passProps: {property: property}
    });
  }

  goToWorkout(event){
    //logic for navigating around app.
    this.props.navigator.push({
      title: "Choose Workout",
      component: WorkoutChoose,
    });
  }

  render(){

    return(
      <View style = {styles.container}>
        <Text>It is a good day to Workout</Text>

        <View style = {styles.menuChoice}>
          <TouchableHighlight style = {styles.navButton}
                      underlayColor='orangered'
                      onPress={this.goToWarmups.bind(this)} >
                      <Text style = {styles.buttonText}>Warmup Sets</Text>
          </TouchableHighlight>
        </View>

        <View style = {styles.menuChoice}>
          <TouchableHighlight style = {styles.navButton}
                      underlayColor='orangered'
                      onPress={this.goToWorkout.bind(this)} >
                      <Text style = {styles.buttonText}>New Workout</Text>
          </TouchableHighlight>
        </View>
      </View>
    )
  }
}

module.exports = AppNav;

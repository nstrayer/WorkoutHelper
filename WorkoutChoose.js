'use strict';

// Right now this is literally just a wrapper for the warmup sets stuff
// In the future it will be the starting point for the whole app with
// jumping off points for things like which day it is etc.

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

import Dropbox from 'dropbox';
// import DropboxToken from './myToken.js';
import RoutineList from './RoutineList';

var styles = StyleSheet.create({
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
    description: {
        marginBottom: 20,
        fontSize: 18,
        textAlign: 'center',
        color: 'steelblue'
    },
    buttonText: {
        fontSize: 18,
        color: 'white',
        alignSelf: 'center'
    },
    button: {
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
});

class WorkoutChoose extends Component {

    constructor(props) {
        super(props);
        this.state = {
            downloaded_workouts: false,
            workout_list: null,
            dbConnection: null,
            token: this.props.token,
        };

        this.getDropboxFiles();
    }

    getDropboxFiles(){
      var dbx = new Dropbox({ accessToken: this.state.token});
      dbx.filesListFolder({path: ''})
        .then((response) => {
          this.setState({downloaded_workouts: true,
                         workout_list: response,
                         dbConnection: dbx});
        })
        .catch(function(error) {
          console.log(error);
        });
    }

    render() {
        var spinner = !this.state.downloaded_workouts?
            (
                <View>
                    <Text>Pulling from Dropbox...</Text>
                    <ActivityIndicator size='large'/>
                </View>
            ) :
            (
                <View/>
            );

        const theList = !this.state.downloaded_workouts?
          (<Text> ... </Text>):
          (<RoutineList
              dbresponse = {this.state.workout_list}
              dbConnection = {this.state.dbConnection}
              navigator = {this.props.navigator}
              token = {this.props.token}
           />);

        return (
            <View style = {styles.container}>
                <Text style = {styles.description}>
                  {`Let's choose a workout`}
                </Text>
                {spinner}
                {theList}
            </View>
        );
    }
}

//send out what we just made so it can be imported.
module.exports = WorkoutChoose;

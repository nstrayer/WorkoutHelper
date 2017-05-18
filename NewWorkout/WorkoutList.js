'use strict';
// list of currently loaded workout templates in the dropbox folder.

import React, { Component } from 'react'
import {
    StyleSheet,
    Text,
    TextInput,
    View,
    TouchableHighlight,
    ActivityIndicator,
    ListView,
    Image
} from 'react-native';
import RNFS from 'react-native-fs';

import RoutineView from '../RoutineView';
import {colors, mainStyles}  from '../appStyles'
import WorkoutButton from './WorkoutButton';

class RoutineList extends Component{
    constructor(props){
        super(props);
    }
    render(){
        let {routines} = this.props;
        let routineList = routines?
            (routines.map(r => <WorkoutButton key = {r.title} routine = {r} /> )) :
            (<Text> {`No local routines, try syncing with dropbox`} </Text>)
        return(
            <View style = {styles.workoutContainer}>
                {routineList}
            </View>
        )
    }
}

var styles = StyleSheet.create({
    workoutContainer:{
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    separator: {
        height: 1,
        backgroundColor: '#dddddd'
    },
});

module.exports = RoutineList;

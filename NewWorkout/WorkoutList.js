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

import {colors, mainStyles}  from '../appStyles'
import WorkoutButton from './WorkoutButton';
// import RoutineView from '../RoutineView';
import DayChoose from '../DayChoose/DayChoose';

class WorkoutList extends Component{
    constructor(props){
        super(props);
    }

    onRoutineSelect(routine){
        console.log(routine)
        //navigate to the routine in app.
        this.props.navigator.push({
            title: "Routine",
            component: DayChoose,
            passProps: {
                routine: routine,
                navigator: this.props.navigator
            }
        });
    }

    render(){
        let {routines} = this.props;
        let routineList = routines?
            (routines.map(r => <WorkoutButton
                key = {r.title}
                routine = {r}
                buttonPress = {this.onRoutineSelect.bind(this)} /> )) :
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
    }
});

module.exports = WorkoutList;

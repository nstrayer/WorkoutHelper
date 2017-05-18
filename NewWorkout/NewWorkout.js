'use strict';

import React, { Component } from 'react'
import {
    StyleSheet,
    Text,
    View,
    ActivityIndicator,
} from 'react-native';

import {colors, mainStyles}  from '../appStyles.js';
import availableFiles        from '../fsHelpers/availableFiles';
import multiDownload         from '../fsHelpers/multiDownload';

import listAvailableRoutines from '../dropboxHelpers/listAvailableRoutines';
import downloadRoutine       from '../dropboxHelpers/downloadRoutine';


import WorkoutList from './WorkoutList';
import SyncButton from './SyncButton';

class WorkoutChoose extends Component {

    constructor(props) {
        super(props);

        this.state = {
            token: this.props.token,
            routines: null,
            syncing: false
        }
    }

    componentDidMount() {
        this.loadRoutines();
    }

    async loadRoutines(){

        const routines = await this.getWorkouts();

        //now we have all the data's set our state.
        this.setState({routines: routines})
    }

    async getWorkouts(){

        let localRoutinePaths = await availableFiles(".json");
        let routineData = []

        if(localRoutinePaths.length > 0){
            let rawRoutineData = await multiDownload(localRoutinePaths)

            for(let data of rawRoutineData){
                try{
                    routineData.push(JSON.parse(data))
                } catch(error){
                    console.log("this file was messed up", data)
                }
            }
        }
        return routineData;
    }

    async getFromDropbox(){

        //Find all routines in our dropbox...
        const dropboxFiles = (await listAvailableRoutines(this.props.token))
            .entries
            .map(file => ({name: file.name,path: file.path_display}) )

        for (let file of dropboxFiles){
            console.log(`downloading ${file.name}`)
            await downloadRoutine(file.path, file.name)
        }
    }

    async syncWithDropbox(){
        this.setState({syncing: true})
        await this.getFromDropbox()
        await this.loadRoutines()
        this.setState({syncing: false})
    }

    render(){
        let workoutList = this.state.syncing?
            (<ActivityIndicator size='large'/>):
            (<WorkoutList
                routines = {this.state.routines}
                navigator = {this.props.navigator}
            />)

        return(
            <View style = {[mainStyles.container, {flexDirection:"column"}]}>
                <View style = {mainStyles.titleWrap}>
                    <Text style = {mainStyles.largeText}>{this.state.syncing? `Syncing with Dropbox`:`Choose your workout`}</Text>
                </View>
                <View style = {styles.navigation}>
                    {workoutList}
                </View>
                <View style = {styles.sync}>
                    <SyncButton onPress = {this.syncWithDropbox.bind(this)}/>
                </View>
            </View>
        )
  }
}

var styles = StyleSheet.create({
    navigation: {
        flex: 3,
    },
    sync: {
        flex: 1,
        justifyContent: 'center',
    }
});


//send out what we just made so it can be imported.
module.exports = WorkoutChoose;

'use strict';

// Right now this is literally just a wrapper for the warmup sets stuff
// In the future it will be the starting point for the whole app with
// jumping off points for things like which day it is etc.
import {buttonMain, buttonMainOutline, buttonDone, buttonDoneOutline, textGrey, textBlue} from './appColors';
import React, { Component } from 'react'
import {
    StyleSheet,
    Text,
    TextInput,
    View,
    TouchableHighlight,
    ActivityIndicator,
    ScrollView,
    Image
} from 'react-native';

import availableFiles        from './fsHelpers/availableFiles';
import multiDownload         from './fsHelpers/multiDownload';
import deleteFile            from './fsHelpers/deleteFile';
import downloadRoutine       from './dropboxHelpers/downloadRoutine';
import listAvailableRoutines from './dropboxHelpers/listAvailableRoutines';
import RoutineList           from './RoutineList';


class WorkoutChoose extends Component {

    constructor(props) {
        super(props);
        this.state = {
            header_text: `Let's choose a workout`,
            workout_list: [],
            downloading: true
        };
    }

    componentDidMount() {
        // this.deleteLocalRoutines()
        this.loadData();
    }

    async loadData(){

        const routines = await this.getWorkouts();

        //now we have all the data's set our state.
        this.setState({
            downloading: false,
            workout_list: routines,
            header_text: `Let's choose a workout`
        })
    }

    async getWorkouts(){

        let localRoutinePaths = await availableFiles(".json");
        let rawRoutineData;

        if(localRoutinePaths.length > 0){
            rawRoutineData = await multiDownload(localRoutinePaths)
        } else {
            //if we didn't find any local routines, let the user know and search for some on dropbox.
            this.setState({header_text: "Checking Dropbox for routines."});

            //Download routines from dropbox to local memory
            const cloudResults = await listAvailableRoutines(this.props.token);

            for(let r of cloudResults.entries){
                await downloadRoutine(r.path_display, r.name)
            }

            //Now that we have local files, try grabbing their paths again
            localRoutinePaths = await availableFiles(".json");

            //and downloading them.
            rawRoutineData = await multiDownload(localRoutinePaths)
        }

        let routineData = []
        for(let data of rawRoutineData){
            try{
                routineData.push(JSON.parse(data))
            } catch(error){
                console.log("this file was messed up", data)
            }
        }

        return routineData;
    }

    async getFromDropbox(){

        this.setState({
            downloading: true
        })

        //Find all routines in our dropbox...
        const cloudResults = await listAvailableRoutines(this.props.token);

        const dropboxFiles = cloudResults.entries.map(file => {
            return {name: file.name, path: file.path_display}
        })

        //we want to download all the routines that are on dropbox and local
        //and also the ones not on local but on dropbox. We won't replace the files
        //that we have on local but not dropbox because we may have created them.
        for (let file of dropboxFiles){
            console.log(`downloading ${file.name}`)
            await downloadRoutine(file.path, file.name)
        }

        //now rerun the get workouts function to load these routines into memory.
        await this.loadData();
    }

    async deleteLocalRoutines(){
        const localRoutinePaths = await availableFiles(".json");

        await localRoutinePaths.map(r => deleteFile(r))
        console.log("deleted the following routines from your local storage", localRoutinePaths)
    }


    render() {
        const theList = this.state.downloading?
            (<ActivityIndicator size='large'/>):
            (
                <View>
                    <RoutineList
                        workouts = {this.state.workout_list}
                        history = {this.state.history}
                        navigator = {this.props.navigator}
                    />
                </View>
            );

        return (
            <View style = {styles.container}>
                <ScrollView>
                    <Text style = {styles.description}>
                      {this.state.header_text}
                    </Text>
                    {theList}
                </ScrollView>
                <View style = {styles.buttonContainer}>
                    <TouchableHighlight
                        style = {styles.downloadButton}
                        onPress={async () => await this.getFromDropbox()}
                        underlayColor='#dddddd'
                    >
                        <Text style = {styles.buttonText}> {`Sync workouts`} </Text>
                    </TouchableHighlight>
                </View>
            </View>
        );
    }
}

var styles = StyleSheet.create({
    container:{
        padding: 30,
        marginTop: 65,
        alignItems: 'center',
        flex: 1
    },
    flowRight: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'stretch'
    },
    description: {
        marginBottom: 20,
        fontSize: 24,
        textAlign: 'center',
        color: textBlue
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
        backgroundColor: buttonMain,
        borderColor: buttonMainOutline,
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 10,
        alignSelf: 'stretch',
        justifyContent: 'center'
    },
    buttonContainer:{
        flex: 1,
        padding: 15,
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0
    },
    downloadButton: {
        height: 50,
        flexDirection: 'row',
        backgroundColor: buttonMain,
        borderColor: buttonMainOutline,
        borderWidth: 1,
        borderRadius: 8,
        alignSelf: 'stretch',
        justifyContent: 'center',
    },
    buttonText: {
        fontSize: 18,
        color: 'white',
        alignSelf: 'center'
    },
});


//send out what we just made so it can be imported.
module.exports = WorkoutChoose;

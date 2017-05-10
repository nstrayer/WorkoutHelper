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
    ScrollView,
    Image
} from 'react-native';

import Dropbox from 'dropbox';
import RoutineList from './RoutineList';
import findFiles from './findFiles';
import downloadFile from './downloadFile';
import downloadRoutines from './downloadRoutines';
import deleteFile from './deleteFile';
import listAvailableRoutines from './dropboxHelpers/listAvailableRoutines';
import downloadRoutine from './dropboxHelpers/downloadRoutine';

class WorkoutChoose extends Component {

    constructor(props) {
        super(props);
        this.state = {
            have_workouts: false,
            header_text: `Let's choose a workout`,
            workout_list: [],
            dbConnection: null,
            token: this.props.token,
            downloading: false
        };

        this.checkForWorkouts();
        // this.grabRoutines()
    }

    checkForWorkouts(){
        let localRoutinePaths;

        findFiles(".json")
            .then( results => {
                if(results.length > 0){
                    this.downloadWorkouts(results);
                } else {
                    this.setState({header_text: "No local routines found, checking dropbox."})
                    this.getFromDropbox();
                }
            })
            .catch((error) => console.log(error));
    }

    getFromDropbox(){
        downloadRoutines()
            .then(routineData => {
                //now look for the routines again, they will be there.
                this.checkForWorkouts();
            })
            .catch(function(error) {
              console.log(error);
            });
    }

    downloadWorkouts(workoutNames){
        //makes an array of promises with the file contents.
        let workoutContents = Promise.all( workoutNames.map(workout => downloadFile(workout)) ) ;

        //once our promises return, loop through them and extract their json goodness.
        workoutContents.then(data => {
            const parsedWorkouts = data.map(workout => JSON.parse(workout));
            console.log(parsedWorkouts);
            this.setState({
                have_workouts: true,
                workout_list: parsedWorkouts
            })
        })
    }

    async grabRoutines(){
        console.log("running grabRoutines")

        // //set spinner a spinnin'
        // this.setState({
        //     downloading: true
        // });

        let localRoutines = await findFiles(".json");
        console.log("current local routines", localRoutines)

        let cloudResults = await listAvailableRoutines(this.props.token);

        const cloudRoutines = cloudResults.entries.map(r => r.name);

        await localRoutines
            .filter(r => !cloudRoutines.includes(r))
            .forEach(r => deleteFile(r) );

        console.log("deleted local files that were not on dropbox")

        const cloud_not_local =  cloudRoutines .filter(r => !localRoutines.includes(r))

        await cloudResults.entries
            .filter(r => cloud_not_local.includes(r.name))
            .forEach(r => downloadRoutine(r.path_display, r.name, this.props.token) );

        console.log("downloaded all the routines that were on dropbox but not local", cloud_not_local)

        //now reload all the routines into memory and update the state variable for routine info.
    }

    render() {

        const theList = this.state.downloading || !this.state.have_workouts?
            (<ActivityIndicator size='large'/>):
            (
                <View>
                    <RoutineList
                        workouts = {this.state.workout_list}
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
                        onPress={() => this.grabRoutines()}
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
        color: '#3182bd'
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
        backgroundColor: '#2bcdb1',
        borderColor: '#1da890',
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

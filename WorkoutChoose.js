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

import RoutineList from './RoutineList';
import findFiles from './findFiles';
import downloadFile from './downloadFile';
import deleteFile from './deleteFile';
import listAvailableRoutines from './dropboxHelpers/listAvailableRoutines';
import downloadRoutine from './dropboxHelpers/downloadRoutine';

class WorkoutChoose extends Component {

    constructor(props) {
        super(props);
        this.state = {
            header_text: `Let's choose a workout`,
            workout_list: [],
            dbConnection: null,
            token: this.props.token,
            downloading: true
        };
    }

    componentDidMount() {
        this.checkForWorkouts();
        // this.deleteLocalRoutines()
        //     .then(r => {})
        //     .catch(err => console.log(error))
    }

    async checkForWorkouts(){
        let rawRoutines;
        let localRoutinePaths = await findFiles(".json");

        if(localRoutinePaths.length > 0){
            rawRoutines = await this.loadLocalRoutines(localRoutinePaths);
        } else {
            //if we didn't find any local routines, let the user know and search for some on dropbox.
            this.setState({header_text: "Checking Dropbox for routines."});
            //Download routines from dropbox to local memory
            const cloudResults = await listAvailableRoutines(this.props.token);

            for(let r of cloudResults.entries){
                await downloadRoutine(r.path_display, r.name)
            }

            //Now that we have local files, try grabbing their paths again
            localRoutinePaths = await findFiles(".json");

            if(localRoutinePaths.length < 1) this.setState({header_text: "Somethings gone horribly wrong. Try restarting app."})

            rawRoutines = await this.loadLocalRoutines(localRoutinePaths);
        }
        //now we have all the data's set our state.
        this.setState({
            downloading: false,
            workout_list: this.parseRoutines(rawRoutines),
            header_text: `Let's choose a workout`
        })
    }

    async getFromDropbox(){

        this.setState({
            downloading: true
        })

        //kill all the local workouts. This will need to change once we allow creation of workouts.
        await this.deleteLocalRoutines();

        //now rerun the check for workouts function which will default to syncing with dropbox because we have no local routines anymore.
        await this.checkForWorkouts();
    }

    async deleteLocalRoutines(){
        const localRoutinePaths = await findFiles(".json");

        await localRoutinePaths.map(r => deleteFile(r))
        console.log("deleted the following routines from your local storage", localRoutinePaths)
    }

    async loadLocalRoutines(paths){
        this.setState({header_text: "Loading routines."})
        let rawRoutines = [];
        for (let localRoutinePath of paths){
            let rawRoutine = await downloadFile(localRoutinePath);
            rawRoutines.push(rawRoutine)
        }
        return(rawRoutines)
    }

    parseRoutines(stringData){
        return stringData.map(workout => JSON.parse(workout));
    };

    render() {

        const theList = this.state.downloading?
            (<ActivityIndicator size='large'/>):
            (
                <View>
                    <RoutineList
                        workouts = {this.state.workout_list}
                        navigator = {this.props.navigator}
                        token = {this.props.token}
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

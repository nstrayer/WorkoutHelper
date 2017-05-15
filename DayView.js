'use strict';

// View a single day of a routine.
// Lists lifts in order with an indented list of the individual sets below them
import {buttonMain, buttonMainOutline, buttonDone, buttonDoneOutline, textGrey, textBlue} from './appColors';
import React, { Component } from 'react'
import {
    StyleSheet,
    Text,
    View,
    TouchableHighlight,
    ActivityIndicator,
    ListView,
} from 'react-native';
import SetView from './SetView';
import sendHistoryToDropbox from './dropboxHelpers/sendHistoryToDropbox';
import checkForFile from './checkForFile';
import downloadFile from './downloadFile';
import getDateTime from './getDateTime';
import roundToFive from './roundToFive';
import updateHistory from './updateHistory';
import saveFile from './saveFile';

class DayView extends Component{
    constructor(props){
        super(props);

        var dataSource = new ListView.DataSource(
            {rowHasChanged: (r1,r2) => (r1.name !== r2.name)}
        );

        const {date} = getDateTime();

        this.state = {
            ds: dataSource,
            dataSource: dataSource.cloneWithRows(this.props.lifts),
            lifts: this.props.lifts,
            history: null,
            date: date,
            selected: true,
            dayID: this.props.id,
        }
        this.grabHistory();
    }

    async addNewRecord(newData){
        let dataToAdd = newData;

        const {date, time} = getDateTime();
        dataToAdd.date = date;
        dataToAdd.time = time;
        dataToAdd.routine = this.props.routine;

        //send to the file system to update records.
        const newHistory = await updateHistory(dataToAdd);

        this.setState({history: newHistory})
    }

    async grabHistory(){
        try {
            const rawHistory = await downloadFile(`liftHistory.csv`)
            this.setState({history: JSON.parse(rawHistory)})
        } catch(error){
            console.log("seems we don't have a lift history file, let's make one")
            await saveFile(`liftHistory.csv`, "[]")
            this.setState({history: []})
        }
    }

    renderLift(liftData) {

        let liftHistory = this.state.history
            .filter(s => s.lift === liftData.name && s.date === this.state.date)

        return (
            <View>
                <View style={styles.liftSets}>
                    <SetView
                        data    = {liftData}
                        routine = {this.props.routine}
                        liftHistory = {liftHistory}
                        onSavedData = { newData => this.addNewRecord(newData) }
                    />
                </View>
            </View>
        );
    }

    finishWorkout(){
        sendHistoryToDropbox()
            .then(resp => console.log("done uploading"))
            .catch(error => console.log(error))
        this.props.navigator.pop()
    }

    addLift(){

        let lifts = this.state.lifts;
        lifts.push({
            name: "My New Lift",
            percentage: 100,
            reps: 10,
            sets: 1,
        })

        this.setState({
            dataSource: this.state.ds.cloneWithRows(lifts),
            lifts: lifts,
            selected: true,
            dayID: this.props.id,
        });
        console.log("running add lift", lifts)
    }

    footer(){
        return (
            <View>
                <View style = {styles.buttonContainer}>
                    <TouchableHighlight
                        style = {styles.doneButton}
                        onPress={() => this.addLift()}
                        underlayColor='#dddddd'
                    >
                        <Text style = {styles.buttonText}> {`Add Lift`} </Text>
                    </TouchableHighlight>
                </View>

                <View style = {styles.buttonContainer}>
                    <TouchableHighlight
                        style = {styles.doneButton}
                        onPress={() => this.finishWorkout()}
                        underlayColor='#dddddd'
                    >
                        <Text style = {styles.buttonText}> {`Done with workout`} </Text>
                    </TouchableHighlight>
                </View>
            </View>
        )
    }

    render(){
        let loadingHistory = this.state.history == null?
            (<ActivityIndicator size='large'/>):
            (
                <ListView
                    dataSource= {this.state.dataSource}
                    renderRow= {this.renderLift.bind(this)}
                    renderFooter = {this.footer.bind(this)}
                />
            );
        return (
            <View style = {styles.pageContainer}>
                {loadingHistory}
            </View>
        )
    }
}

var styles = StyleSheet.create({
    buttonContainer:{
        flex: 1,
        paddingHorizontal: 15,
    },
    doneButton: {
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
    pageContainer:{
        flex: 1,
        paddingTop: 65,
    },
    resultsList: {
        marginBottom: 20,
        fontSize: 18,
        textAlign: 'center',
        color: '#3182bd'
    },
    rowContainer: {
        flexDirection: 'column',
    },
    separator: {
        height: 1,
        backgroundColor: '#dddddd'
    },
    liftName:{
        flex: 1,
        // backgroundColor: '#ccebc5',
        padding:10,
    },
    liftSets:{
        flex:1,
        padding:10,
        // backgroundColor: '#b3cde3',
    },
    title:{
        fontSize: 30,
        color: '#656565'
    }
});

module.exports = DayView;

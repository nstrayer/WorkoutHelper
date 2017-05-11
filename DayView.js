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
    ListView,
} from 'react-native';
import SetView from './SetView';
import sendHistoryToDropbox from './dropboxHelpers/sendHistoryToDropbox';

class DayView extends Component{
    constructor(props){
        super(props);

        var dataSource = new ListView.DataSource(
            {rowHasChanged: (r1,r2) => (r1.name !== r2.name)}
        );

        this.state = {
            dataSource: dataSource.cloneWithRows(this.props.lifts),
            lifts: this.props.lifts,
            selected: true,
            dayID: this.props.id,
        }
    }

    renderLift(liftData) {
        return (
            <View>
                <View style={styles.liftSets}>
                    <SetView
                        liftName = {liftData.name}
                        liftData = {liftData}
                        routine = {this.props.routine}
                        dbConnection = {this.props.dbConnection}
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

    uploadButton(){
        return (
            <View style = {styles.buttonContainer}>
                <TouchableHighlight
                    style = {styles.doneButton}
                    onPress={() => this.finishWorkout()}
                    underlayColor='#dddddd'
                >
                    <Text style = {styles.buttonText}> {`Done with workout`} </Text>
                </TouchableHighlight>
            </View>
        )
    }

    render(){
        return(
            <View style = {styles.pageContainer}>
                <ListView
                    dataSource= {this.state.dataSource}
                    renderRow= {this.renderLift.bind(this)}
                    renderFooter = {this.uploadButton.bind(this)}
                />
            </View>
        )
    }
}

var styles = StyleSheet.create({
    buttonContainer:{
        flex: 1,
        padding: 15,
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
        flex: 1
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

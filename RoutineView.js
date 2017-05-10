'use strict';

//Takes a json object defining a routine and displays a list of the days for given routine

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
import DayView from './DayView';
import findFiles from './findFiles';
import saveFile from './saveFile';
import checkForFile from './checkForFile';
import deleteFile from './deleteFile';
import downloadFile from './downloadFile';
import sendHistoryToDropbox from './sendHistoryToDropbox';

class RoutineView extends Component{
    constructor(props){
        super(props);

        var dataSource = new ListView.DataSource(
            {rowHasChanged: (r1,r2) => r1.id !== r2.id}
        );

        this.state = {
            dataSource: dataSource.cloneWithRows(this.props.routineData.days),
            title: this.props.routineData.title,
            resultsFile: false,
        }
    }

    componentDidMount(){
        this.lookForResultsFile();

        // downloadFile('liftHistory.csv')
        //     .then(history => {
        //         const parsedHistory = JSON.parse(history)
        //         sendHistoryToDropbox(parsedHistory)
        //     })
        //     .catch(error => console.log(error))
        // deleteFile('liftHistory.csv')
        //     .then(results => console.log("file deleted"))
        //     .catch(error => console.log(error));
    }

    lookForResultsFile(){
        const resultsFileName = `liftHistory.csv`
        //look for a csv for this routine in the storage.
        checkForFile(resultsFileName)
            .then( result => {
                if(result.length > 0){
                    this.setState({resultsFile: true})
                    downloadFile("liftHistory.csv")
                        .then(result => console.log("we have a result file", JSON.parse(result)))
                        .catch(error => console.log(error));
                } else {
                    //no file present, let's make one.
                    console.log("we found no results files, making one now.")
                    saveFile(resultsFileName, `[{"name": "first record"}]`)
                    .then(result => {
                        console.log("initialized a results file")
                        this.setState({resultsFile: true})
                    })
                    .catch(error => console.log("something has gone horribly wrong."))
                }
            })
            .catch(error => console.log(error));
    }

    renderDay(routineData) {
        const dayID = routineData.id;
        const lifts = routineData.lifts.map(l => l.name).join(", ");

        return (
            <TouchableHighlight
                onPress={() => this.goToDay(routineData)}
                underlayColor='#dddddd'
            >
                <View>
                    <View style={styles.rowContainer}>
                        <View style={styles.textContainer}>
                            <Text style={styles.title}>
                                Day {dayID}
                            </Text>
                            <Text>
                                {lifts}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.separator}/>
                </View>
            </TouchableHighlight>
        );
    }

    goToDay(routineData){
        this.props.navigator.push({
            title: `Day ${routineData.id}`,
            component: DayView,
            passProps: {
                routine: this.state.title,
                id: routineData.id,
                lifts: routineData.lifts,
                navigator: this.props.navigator
            }
        });
    }

    render(){
        return(
            <View style = {styles.days}>
                <Text style = {styles.title}>
                    {this.state.title}
                </Text>
                <ListView
                    dataSource={this.state.dataSource}
                    renderRow={this.renderDay.bind(this)}
                />
            </View>
        );
    }
}

var styles = StyleSheet.create({
    days:{
        flex: 1
    },
    resultsList: {
        marginBottom: 20,
        fontSize: 18,
        textAlign: 'center',
        color: 'steelblue'
    },
    rowContainer: {
        flexDirection: 'row',
        padding: 10
    },
    separator: {
        height: 1,
        backgroundColor: '#dddddd'
    },
    title: {
        fontSize: 20,
        color: '#3182bd'
    },
});

module.exports = RoutineView;

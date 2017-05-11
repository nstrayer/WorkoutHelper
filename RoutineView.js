'use strict';

//Takes a json object defining a routine and displays a list of the days for given routine
import {buttonMain, buttonMainOutline, buttonDone, buttonDoneOutline, textGrey, textBlue} from './appColors';
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
import saveFile from './saveFile';
import checkForFile from './checkForFile';
import downloadFile from './downloadFile';

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
    }

    async lookForResultsFile(){
        const resultsFileName = `liftHistory.csv`

        //look for a csv for this routine in the storage.
        const searchResult = await checkForFile(resultsFileName);

        if(searchResult.length > 0){
            console.log("found and loaded a results file")
            const resultFile = await downloadFile("liftHistory.csv")
        } else {
            //no file present, let's make one.
            console.log("we found no results files, making one now.")
            await saveFile(resultsFileName, `[{"name": "first record"}]`)
            console.log("initialized a results file")
        }
        this.setState({resultsFile: true})
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
        color: textBlue
    },
});

module.exports = RoutineView;

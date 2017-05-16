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
import _ from "lodash";
// import {colors, mainStyles}  from './appStyles.js'

import SetView from './SetView';
import sendHistoryToDropbox from './dropboxHelpers/sendHistoryToDropbox';
import downloadFile from './fsHelpers/downloadFile';
import getDateTime from './getDateTime';
import updateHistory from './updateHistory';
import saveFile from './fsHelpers/saveFile';


const ds = new ListView.DataSource(
    {rowHasChanged: (r1,r2) => r1 !== r2}
);

class DayView extends Component{
    constructor(props){
        super(props);

        const {id} = this.props;
        this.lifts = this.props.lifts;

        this.state = {
            dataSource: ds.cloneWithRows(this.lifts),
            lifts: this.lifts,
            dayID: id,
            loading: true
        }
    }


    componentDidMount(){
        //go into history and grab all our info for this routine.
        this.grabHistory();
    }

    async grabHistory(){
        try {
            const {routine, id: day, lifts: defaultLifts} = this.props
            const {date} = getDateTime();
            const history = JSON.parse(await downloadFile(`liftHistory.csv`))

            //gather each lifts last lifted weight and assign as setweight
            const lastLiftWeights = _(history)
                .chain()
                .filter(set => set.routine === routine)
                .groupBy("lift")
                .map((records, lift) => {
                    return {name: lift, weight: _.findLast(records).weight}
                })
                .value()

            //default all the weights to 0
            defaultLifts.forEach(r => r.weight = "0")
            for(let record of lastLiftWeights){
                let {name, weight} = record;

                //find where we have a match if we do...
                let indexInDefaults = _.findIndex(defaultLifts, lift => lift.name === name);

                if(indexInDefaults !== -1){
                    defaultLifts[indexInDefaults].weight = weight
                }
            }

            //if we want persistance to go beyond just navigating between lifts, start here.
            // const doneToday = history.filter(set => set.routine === routine && set.date === date)

            this.setState({
                dataSource: ds.cloneWithRows(defaultLifts),
                lifts: defaultLifts,
                loading: false
            })
        } catch(error){
            // console.log("seems we don't have a lift history file, let's make one")
            // await saveFile(`liftHistory.csv`, "[]")
        }
    }

    async addNewRecord(newData){
        let dataToAdd = newData;

        const {date, time} = getDateTime();
        dataToAdd.date = date;
        dataToAdd.time = time;
        dataToAdd.routine = this.props.routine;

        //send to the file system to update records.
        const newHistory = await updateHistory(dataToAdd);

        this.grabHistory()
    }


    renderLift(liftData) {
        return (
            <View>
                <View style={styles.liftSets}>
                    <SetView
                        data          = {liftData}
                        routine       = {this.props.routine}
                        onSavedData   = { newData => this.addNewRecord(newData) }
                        deleteLastSet = { liftName => this.deleteLift(liftName)}
                    />
                </View>
            </View>
        );
    }

    async finishWorkout(){
        try{
            await sendHistoryToDropbox()
            console.log("done uploading")
        } catch(error){
             console.log(error)
        }
        this.props.navigator.pop()
    }

    deleteLift(liftName){
        _.remove(this.lifts, l => l.name === liftName)

        const newLifts = this.lifts;
        console.table(newLifts)
        this.setState({
            dataSource: ds.cloneWithRows(newLifts),
        })
    }

    addLift(){
        let lifts = this.lifts;
        lifts.push({
            name: "New Lift",
            notes: "",
            sets: [
                {reps: 5, setNum: 1, weight: "0"}
            ],
            warmup: [],
            weight: "0"
        })
        this.setState({
            dataSource: ds.cloneWithRows(lifts),
            lifts: lifts,
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
        let loadingHistory = this.state.loading?
            (<ActivityIndicator size='large'/>):
            (
                <ListView
                    dataSource = {this.state.dataSource}
                    renderRow = {this.renderLift.bind(this)}
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

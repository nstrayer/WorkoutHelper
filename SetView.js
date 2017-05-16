'use strict';
// View a single day of a routine.
// Lists lifts in order with an indented list of the individual sets below them

import {
    buttonMain,
    buttonMainOutline,
    buttonDone,
    buttonDoneOutline,
    textGrey,
    textBlue,
    buttonDisabled,
    buttonDisabledOutline
} from './appColors';
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
import saveSetInfo from './saveSetInfo';
import roundToFive from './roundToFive';
import getDateTime from './getDateTime'

class SetView extends Component{
    constructor(props){
        super(props);

        //update rows if their weight changes. This is when the user puts a new
        //overall weight in and we need to update multiple rows at once.
        var dataSource = new ListView.DataSource(
            {rowHasChanged: (r1,r2) => r1 !== r2}
        );

        //get out the info stored in our lift info.
        const {warmup, notes} = this.props.data;
        let {sets,name} = this.props.data;

        //add usage info to each set so the ui knows how to deal with the done button
        sets = this.addUsageInfo(sets);
        sets = this.fillInToday(sets)

        this.state = {
            name: name,
            sets: sets,
            warmup: warmup,
            notes: notes,
            setWeight: this.getLastSetWeight(),
            liftHistory: this.props.liftHistory,
            ds: dataSource,
            dataSource: dataSource.cloneWithRows(sets),
            oneLiftLeft: sets.length === 1,
        }

    }

    // componentDidMount(){
    //     //fill in the set weight with the last value the user lifted for this lift and routine.
    //     this.getLastSetWeight()
    // }

    fillInToday(sets){
        let today = this.props.liftHistory
            .filter(s => s.date === getDateTime().date)

        const setNumsSeenToday = today.map(s => s.setNum)
        const setNumsPrescribed = sets.map(s=>s.setNum)
        const uniqueSetNums = [...new Set(setNumsSeenToday.concat(setNumsPrescribed))]

        const newSetsInfo = uniqueSetNums.map( setNum => {
            //find last entry in the array of the given setNum in case we have duplicates
            let lastInstance = setNumsSeenToday.lastIndexOf(setNum)
            if(lastInstance !== -1){
                //if the set in the uniquely seen sets was in our history, fill it in
                let {difficulty, reps, setNum, weight} = today[lastInstance]
                return {
                    difficulty: difficulty,
                    reps: reps,
                    setNum: setNum,
                    weight: weight,
                    userChanged: true
                }
            } else {
                //if the history didn't contain the set just fill it in with the prescribed values.
                return sets[setNumsPrescribed.indexOf(setNum)]
            }

        })
        return newSetsInfo;
    }

    getLastSetWeight(){
        const {liftHistory} = this.props
        const newSetWeight = liftHistory.length > 0 ? this.props.liftHistory.slice(-1)[0].weight: "0"
        console.log("new set weight", newSetWeight)
        return newSetWeight
    }

    addUsageInfo(sets){
        //this will eventually check for history info from today
        sets.forEach(s => {
            s.difficulty = "NA"
            s.userChanged = false
        })
        return(sets)
    }

    warmupSets(){
        const {warmup, setWeight} = this.state;

        const warmupMessage = warmup
            .map(s => `${roundToFive(setWeight * (s.percentage/100))}x${s.reps}`)
            .join(", ")

        return warmupMessage.length > 0?
            (
                <Text style = {styles.warmupSets}>
                    Warmup: {warmupMessage}
                </Text>
            ):
            (
                <View/>
            )
    }

    finishedSet(setInfo){
        const {setNum, reps, weight} = setInfo;

        let {sets,name} = this.state;

        sets.forEach(s => {
            if(s.setNum === setNum && s.difficulty === "NA"){
                s.difficulty = "done"
            } else if (s.setNum === setNum && s.difficulty !== "NA") {
                //if you click on an already done set, undo it.
                s.difficulty = "NA"
            }
        })

        const setResults = {
            weight: weight,
            reps: reps,
            setNum: setNum,
            lift: name,
            difficulty: "done",
        }

        this.props.onSavedData(setResults)
        this.updateliftInfo(sets)
    }

    newSetWeight(inputWeight,setNum){
        let sets = this.state.sets
        sets[setNum - 1].weight = inputWeight;
        sets[setNum - 1].userChanged = true;
        this.updateliftInfo(sets)
    }

    newRepNum(inputReps,setNum){
        let sets = this.state.sets
        sets[setNum - 1].reps = inputReps;
        sets[setNum - 1].userChanged = true;
        this.updateliftInfo(sets)
    }

    //when the user puts in a different overall set weight, update the row data accordingly.
    updateLiftWeight(newWeight){
        this.setState({setWeight: newWeight});
        let sets = this.state.sets
        //if the user hasnt themselves changed a set's weight, modify it to the new overall weight.
        sets.forEach(s => {
            s.weight = !s.userChanged? newWeight: s.weight
        })
        this.updateliftInfo(sets)
    }

    //updates the set info state variable and also the set's given rows.
    updateliftInfo(newSetInfo){
        this.setState({
            liftInfo: newSetInfo,
            dataSource: this.state.ds.cloneWithRows(newSetInfo)
        });
    }

    //if the user clicks a button to add a set then append another one to the set data
    //We will autofill in its numbers with those from the last current set.
    addSet(){
        console.log("old set info",this.state.liftInfo)
        let liftInfo = this.state.liftInfo
        let lastSet = JSON.parse(JSON.stringify(liftInfo.slice(-1)[0]))
        lastSet.userChanged = false
        lastSet.didIt = false
        lastSet.setNum = lastSet.setNum + 1

        //append this new set to our set info.
        liftInfo.push(lastSet)

        console.log("new set info",liftInfo)

        this.setState({
            oneLiftLeft: liftInfo.length === 1,
            liftInfo: liftInfo,
            dataSource: this.state.ds.cloneWithRows(liftInfo),
        })
    }

    removeSet(){
        //Make sure we don't accidentally delete the last set.
        if(!this.state.oneLiftLeft){
            let liftInfo = this.state.liftInfo
            liftInfo.pop()

            this.setState({
                oneLiftLeft: liftInfo.length === 1,
                liftInfo: liftInfo,
                dataSource: this.state.ds.cloneWithRows(liftInfo),
            })
        }

    }

    setFooter(){
        return(
            <View style={styles.footer}>
                <View style = {styles.setChange}>
                    <TouchableHighlight
                        style = {styles.addRemoveButton}
                        onPress={() => this.addSet()}
                        underlayColor='#dddddd'
                    >
                        <Text style = {styles.addRemoveText}> add set </Text>
                    </TouchableHighlight>
                </View>
                <View style = {styles.setChange}>
                    <TouchableHighlight
                        style = {this.state.oneLiftLeft? styles.disabledButton: styles.addRemoveButton}
                        onPress={() => this.removeSet()}
                        underlayColor='#dddddd'
                    >
                        <Text style = {styles.addRemoveText}> remove set </Text>
                    </TouchableHighlight>
                </View>
            </View>
        )
    }

    renderSet(setInfo) {
        const {setNum, reps, weight} = setInfo;

        return (
            <View>
                <View style={styles.setRow}>
                    <View style = {styles.setInfo}>
                        <Text style={styles.infoText}>
                            Set {setNum}
                        </Text>
                    </View>
                    <View style={styles.repsInfo}>
                        <TextInput
                            style={styles.repInput}
                            keyboardType = 'numeric'
                            placeholder= {`${reps}`}
                            placeholderTextColor = {textGrey}
                            onChangeText = {(text)=> this.newRepNum(text, setNum)}
                        />
                        <Text style = {styles.repsText}> reps </Text>
                    </View>
                    <View style={styles.weightInfo}>
                        <TextInput
                            style={styles.weightInput}
                            keyboardType = 'numeric'
                            placeholder = {`${weight}`}
                            placeholderTextColor = {textGrey}
                            onChangeText = {(text)=> this.newSetWeight(text, setNum)}
                        />
                        <Text style = {styles.poundText}> lbs </Text>
                    </View>

                    <TouchableHighlight
                        style = {setInfo.difficulty !== "NA"? styles.doneItButton : styles.didItButton}
                        onPress={() => this.finishedSet(setInfo)}
                        underlayColor='#dddddd'
                    >
                        <Text style = {styles.didItText}> {setInfo.didIt? '✓': 'done'} </Text>

                    </TouchableHighlight>
                </View>
                <View style={styles.separator}/>
            </View>
        );
    }

    newLiftName(newLiftName){
        // console.log("changed the lift name to ", text)
        let newliftInfo = this.state.liftInfo;
        newliftInfo.forEach(set => set.lift = newLiftName)
        console.log("set info for lift ", newliftInfo)
        this.setState({
            liftName: newLiftName,
            liftInfo: newliftInfo
        })
    }

    render(){
        return(
            <View style = {styles.pageContainer}>
                <View style={styles.header}>
                    <TextInput
                        style={styles.title}
                        keyboardType = 'default'
                        multiline = {true}
                        placeholder = {`${this.state.name}`}
                        placeholderTextColor = {textBlue}
                        onChangeText = { text => this.newLiftName(text)}
                    />
                    <View style={styles.liftWeight}>
                        <TextInput
                            style={styles.weightInputHeader}
                            keyboardType = 'numeric'
                            placeholder= {this.state.setWeight}
                            onChangeText = {(text) => this.updateLiftWeight(text)}
                        />
                        <Text style = {styles.poundTextHeader}> lbs </Text>
                    </View>
                </View>
                <ListView
                    dataSource   = {this.state.dataSource}
                    renderRow    = {this.renderSet.bind(this)}
                    renderHeader = {this.warmupSets.bind(this)}
                    renderFooter = {this.setFooter.bind(this)}
                />
            </View>
        );
    }
}

var styles = StyleSheet.create({
    title:{
        fontSize: 22,
        fontFamily: "Optima-Bold",
        color: textBlue,
        flex:3,
    },
    warmupSets: {
        fontSize: 15,
        color: textGrey,
    },
    liftWeight: {
        flex:3,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    liftWeightInput:{
        textAlign: "right",
        fontSize: 18,
        color: textGrey,
        fontSize: 18,
        flex:4,
    },
    setRow: {
        flex: 1,
        flexDirection: 'row',
        paddingVertical: 6
    },
    header:{
        flexDirection: 'row',
        padding:5,
    },
    footer:{
        flexDirection: 'row',
        justifyContent: 'center',
        padding: 5,
    },
    setChange:{
        flex: 1,
        paddingHorizontal: 20,
    },
    addRemoveButton: {
        backgroundColor: buttonMain,
        borderColor: buttonMainOutline,
        borderWidth: 1,
        borderRadius: 8,
        justifyContent: 'center',
        padding: 3
    },
    disabledButton: {
        backgroundColor: buttonDisabled,
        borderColor: buttonDisabledOutline,
        borderWidth: 1,
        borderRadius: 8,
        justifyContent: 'center',
        padding: 3
    },
    addRemoveText:{
        textAlign: "center",
        fontSize: 15,
        color: 'white',
    },
    repsInfo: {
        flex:2,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    weightInfo: {
        flex:2,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    weightInput:{
        textAlign: "right",
        fontSize: 18,
        color: textGrey,
        fontSize: 18,
        flex:2,
    },
    poundText: {
        textAlign: "left",
        fontSize: 17,
        color: textGrey,
        flex: 3,
    },
    weightInputHeader:{
        textAlign: "right",
        fontSize: 18,
        color: textGrey,
        fontSize: 18,
        flex:4,
    },
    poundTextHeader: {
        textAlign: "left",
        fontSize: 17,
        color: textGrey,
        flex: 1,
    },
    didItText: {
        color: 'white',
    },
    didItButton: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: buttonMain,
        borderColor: buttonMainOutline,
        borderWidth: 1,
        borderRadius: 8,
        alignSelf: 'stretch',
        justifyContent: 'center',
        padding: 5
    },
    doneItButton: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: buttonDone,
        borderColor: buttonDoneOutline,
        borderWidth: 1,
        borderRadius: 8,
        alignSelf: 'stretch',
        justifyContent: 'center',
        padding: 5
    },
    repInput:{
        textAlign: "right",
        fontSize: 18,
        color: textGrey,
        fontSize: 18,
        flex:1,
    },
    repsText: {
        textAlign: "left",
        fontSize: 17,
        color: textGrey,
        flex: 2,
    },
    pageContainer:{
        flex: 1
    },
    separator: {
        height: 1,
        backgroundColor: '#dddddd'
    },
    infoText:{
        fontSize: 20,
        color: textGrey,
    },
});

module.exports = SetView;

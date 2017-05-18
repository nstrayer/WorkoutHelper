'use strict';
// View a single day of a routine.
// Lists lifts in order with an indented list of the individual sets below them

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
import {colors, mainStyles}  from './appStyles.js'
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
        const {
            name,
            notes,
            sets,
            warmup,
            weight,
        } = this.props.data;

        this.state = {
            name: name,
            sets: sets,
            warmup: warmup,
            notes: notes,
            setWeight: weight,
            ds: dataSource,
            dataSource: dataSource.cloneWithRows(sets),
        }

    }

    componentDidMount(){
        this.updateLiftWeight(this.state.setWeight)
    }

    //updates the set info state variable and also the set's given rows.
    updateliftInfo(newSetInfo){
        this.setState({
            liftInfo: newSetInfo,
            dataSource: this.state.ds.cloneWithRows(newSetInfo)
        });
    }

    updateLiftWeight(newWeight){
        this.setState({setWeight: newWeight});
        let sets = this.state.sets
        //if the user hasnt themselves changed a set's weight, modify it to the new overall weight.
        sets.forEach(s => {
            s.weight = !s.userChanged? newWeight: s.weight
        })
        this.updateliftInfo(sets)
    }

    newRepNum(inputReps,setNum){
        let sets = this.state.sets
        sets[setNum - 1].reps = inputReps;
        sets[setNum - 1].userChanged = true;
        this.updateliftInfo(sets)
    }

    newSetWeight(inputWeight,setNum){
        let sets = this.state.sets
        sets[setNum - 1].weight = inputWeight;
        sets[setNum - 1].userChanged = true;
        this.updateliftInfo(sets)
    }

    newSetCompletion(difficulty, setNum){
        let sets = this.state.sets
        sets[setNum - 1].difficulty = difficulty;
        sets[setNum - 1].userChanged = difficulty === "NA"? false: true;
        console.log("logged lift as",difficulty,sets[setNum - 1].userChanged )
        this.updateliftInfo(sets)
    }

    finishedSet(setInfo, setDifficulty = "done"){
        let {name, sets} = this.state;
        //if they've done this set before then undo their effort.
        setInfo.difficulty = ["done", "easy", "hard"].includes(setInfo.difficulty)?"NA": setDifficulty
        const {setNum, reps, weight,difficulty} = setInfo;

        const setResults = {
            lift: name,
            weight: weight,
            reps: reps,
            difficulty: difficulty,
            setNum: setNum,
        }

        this.props.onSavedData(setResults)
        this.newSetCompletion(difficulty,setNum)
    }


    newLiftName(newLiftName){
        // console.log("changed the lift name to ", text)
        let sets = this.state.sets
        sets.forEach(set => set.lift = newLiftName)
        this.setState({
            name: newLiftName,
            sets: sets
        })
    }

    //if the user clicks a button to add a set then append another one to the set data
    //We will autofill in its numbers with those from the last current set.
    addSet(){
        let sets = this.state.sets
        let newSet = JSON.parse(JSON.stringify(sets.slice(-1)[0]))
        newSet.userChanged = false
        newSet.difficulty = "NA"
        newSet.setNum = newSet.setNum + 1

        //append this new set to our set info.
        sets.push(newSet)

        this.setState({
            oneLiftLeft: sets.length === 1,
            sets: sets,
            dataSource: this.state.ds.cloneWithRows(sets),
        })
    }

    removeSet(){
        //Make sure we don't accidentally delete the last set.
        let sets = this.state.sets
        if(sets.length > 1){
            let sets = this.state.sets
            sets.pop()
            this.setState({
                sets: sets,
                dataSource: this.state.ds.cloneWithRows(sets),
            })
        } else {
            this.props.deleteLastSet(this.state.name)
        }
    }

    setFooter(){
        return(
            <View style={mainStyles.inputWrap}>
                <View style = {styles.addRemoveButtons}>
                    <TouchableHighlight
                        style = {mainStyles.smallButton}
                        onPress={() => this.addSet()}
                        underlayColor='#dddddd'
                    >
                        <Text style = {mainStyles.buttonText}> add set </Text>
                    </TouchableHighlight>
                </View>
                <View style = {styles.addRemoveButtons}>
                    <TouchableHighlight
                        style = {this.state.sets.length === 1? [mainStyles.smallButton, {backgroundColor: colors.textGrey}]: mainStyles.smallButton}
                        onPress={() => this.removeSet()}
                        underlayColor='#dddddd'
                    >
                        <Text style = {mainStyles.buttonText}> remove set </Text>
                    </TouchableHighlight>
                </View>
            </View>
        )
    }



    warmupSets(){
        const {warmup, setWeight} = this.state;

        const warmupMessage = warmup
            .map(s => `${roundToFive(+setWeight * (s.percentage/100))}x${s.reps}`)
            .join(", ")

        return warmupMessage.length > 0?
            (
                <View>
                    <Text style = {[styles.warmupSets, {paddingVertical: 8}]}>
                        Warmup: {warmupMessage}
                    </Text>
                </View>
            ):
            (
                <View/>
            )
    }

    renderSet(setInfo) {
        const {setNum, reps, weight} = setInfo;

        return (
            <View>
                <View style={styles.setRow}>
                    <View style={mainStyles.inputWrap}>
                        <TextInput
                            style={styles.input}
                            keyboardType = 'numeric'
                            placeholder= {`${reps}`}
                            placeholderTextColor = {colors.textGrey}
                            onChangeText = {(text)=> this.newRepNum(text, setNum)}
                        />
                        <Text style = {[styles.mediumText, styles.inputLabel]}> reps </Text>
                    </View>
                    <View style={[mainStyles.inputWrap, {flex: 1.4}]}>
                        <TextInput
                            style={styles.input}
                            keyboardType = 'numeric'
                            placeholder = {`${weight}`}
                            placeholderTextColor = {colors.textGrey}
                            onChangeText = {(text)=> this.newSetWeight(text, setNum)}
                        />
                        <Text style = {[styles.mediumText, styles.inputLabel]}> lbs </Text>
                    </View>
                    <View style={[mainStyles.inputWrap, {flex: 2/3}]}>
                        <TouchableHighlight
                            style = {("difficulty" in setInfo) && setInfo.difficulty !== "NA"?
                                [mainStyles.smallButton, {backgroundColor: colors.buttonDone}] : mainStyles.smallButton
                            }
                            onPress={() => this.finishedSet(setInfo)}
                            underlayColor='#dddddd' >
                            <Text style = {mainStyles.buttonText}>
                                {("difficulty" in setInfo) && setInfo.difficulty !== "NA"? '✓': 'done'}
                            </Text>
                        </TouchableHighlight>
                    </View>
                </View>
                <View style={mainStyles.separator}/>
            </View>
        );
    }
    render(){
        return(
            <View style = {[mainStyles.container, {marginTop: 5}]}>
                <View style={styles.header}>
                    <TextInput
                        style={[mainStyles.boldTitle, {flex: 3, color: colors.textBlue, fontSize: 22}]}
                        keyboardType = 'default'
                        multiline = {true}
                        placeholder = {`${this.state.name}`}
                        placeholderTextColor = {colors.textBlue}
                        onChangeText = { text => this.newLiftName(text)}
                    />
                    <View style={[mainStyles.inputWrap, {flex: 2}]}>
                        <TextInput
                            style={[styles.input,{flex: 2} ]}
                            keyboardType = 'numeric'
                            placeholder= {this.state.setWeight}
                            onChangeText = {(text) => this.updateLiftWeight(text)}
                        />
                        <Text style = {[styles.inputLabel,{flex: 1}]}> lbs </Text>
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
    setRow: {
        flex: 1,
        flexDirection: 'row',
        paddingVertical: 6
    },
    footer:{
        flexDirection: 'row',
        justifyContent: 'center',
        padding: 5,
    },
    addRemoveButtons:{
        flex: 1,
    },
    header:{
        flexDirection: 'row',
        padding:5,
    },
    repsInfo: {
        flex:2,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    input:{
        textAlign: "right",
        fontSize: 18,
        color: colors.textGrey,
        flex: 1,
    },
    inputLabel: {
        textAlign: "left",
        flex: 3,
        fontSize: 18,
        color: colors.textGrey,
    },
});

module.exports = SetView;

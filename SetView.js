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
import {colors, mainStyles}  from './appStyles.js'
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

    // componentDidMount(){
    //     //fill in the set weight with the last value the user lifted for this lift and routine.
    //     this.getLastSetWeight()
    // }


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



    // //if the user clicks a button to add a set then append another one to the set data
    // //We will autofill in its numbers with those from the last current set.
    // addSet(){
    //     console.log("old set info",this.state.liftInfo)
    //     let liftInfo = this.state.liftInfo
    //     let lastSet = JSON.parse(JSON.stringify(liftInfo.slice(-1)[0]))
    //     lastSet.userChanged = false
    //     lastSet.didIt = false
    //     lastSet.setNum = lastSet.setNum + 1
    //
    //     //append this new set to our set info.
    //     liftInfo.push(lastSet)
    //
    //     console.log("new set info",liftInfo)
    //
    //     this.setState({
    //         oneLiftLeft: liftInfo.length === 1,
    //         liftInfo: liftInfo,
    //         dataSource: this.state.ds.cloneWithRows(liftInfo),
    //     })
    // }
    //
    // removeSet(){
    //     //Make sure we don't accidentally delete the last set.
    //     if(!this.state.oneLiftLeft){
    //         let liftInfo = this.state.liftInfo
    //         liftInfo.pop()
    //
    //         this.setState({
    //             oneLiftLeft: liftInfo.length === 1,
    //             liftInfo: liftInfo,
    //             dataSource: this.state.ds.cloneWithRows(liftInfo),
    //         })
    //     }
    //
    // }
    //
    // setFooter(){
    //     return(
    //         <View style={styles.footer}>
    //             <View style = {styles.setChange}>
    //                 <TouchableHighlight
    //                     style = {styles.addRemoveButton}
    //                     onPress={() => this.addSet()}
    //                     underlayColor='#dddddd'
    //                 >
    //                     <Text style = {styles.addRemoveText}> add set </Text>
    //                 </TouchableHighlight>
    //             </View>
    //             <View style = {styles.setChange}>
    //                 <TouchableHighlight
    //                     style = {this.state.oneLiftLeft? styles.disabledButton: styles.addRemoveButton}
    //                     onPress={() => this.removeSet()}
    //                     underlayColor='#dddddd'
    //                 >
    //                     <Text style = {styles.addRemoveText}> remove set </Text>
    //                 </TouchableHighlight>
    //             </View>
    //         </View>
    //     )
    // }
    //

    // newLiftName(newLiftName){
    //     // console.log("changed the lift name to ", text)
    //     let newliftInfo = this.state.liftInfo;
    //     newliftInfo.forEach(set => set.lift = newLiftName)
    //     console.log("set info for lift ", newliftInfo)
    //     this.setState({
    //         liftName: newLiftName,
    //         liftInfo: newliftInfo
    //     })
    // }

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
                    <View style={styles.inputWrap}>
                        <TextInput
                            style={styles.input}
                            keyboardType = 'numeric'
                            placeholder= {`${reps}`}
                            placeholderTextColor = {textGrey}
                            onChangeText = {(text)=> this.newRepNum(text, setNum)}
                        />
                        <Text style = {[styles.mediumText, styles.inputLabel]}> reps </Text>
                    </View>
                    <View style={styles.inputWrap}>
                        <TextInput
                            style={styles.input}
                            keyboardType = 'numeric'
                            placeholder = {`${weight}`}
                            placeholderTextColor = {textGrey}
                            onChangeText = {(text)=> this.newSetWeight(text, setNum)}
                        />
                        <Text style = {[styles.mediumText, styles.inputLabel]}> lbs </Text>
                    </View>
                    <View style={[styles.inputWrap, {flex: 1/2}]}>
                        <TouchableHighlight
                            style = {setInfo.difficulty !== "NA"? styles.doneItButton : styles.didItButton}
                            onPress={() => this.finishedSet(setInfo)}
                            underlayColor='#dddddd'
                        >
                            <Text style = {styles.didItText}> {setInfo.didIt? '✓': 'done'} </Text>

                        </TouchableHighlight>
                    </View>
                </View>
                <View style={mainStyles.separator}/>
            </View>
        );
    }
    render(){
        return(
            <View style = {mainStyles.container}>
                <View style={styles.header}>
                    <TextInput
                        style={[mainStyles.boldTitle, {flex: 3, color: colors.textBlue, fontSize: 22}]}
                        keyboardType = 'default'
                        multiline = {true}
                        placeholder = {`${this.state.name}`}
                        placeholderTextColor = {colors.textBlue}
                        onChangeText = { text => this.newLiftName(text)}
                    />
                    <View style={[styles.inputWrap, {flex: 2}]}>
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
                />
            </View>
        );
    }
}

var styles = StyleSheet.create({
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
    inputWrap:{
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    input:{
        textAlign: "right",
        fontSize: 18,
        color: textGrey,
        flex: 1,
    },
    inputLabel: {
        textAlign: "left",
        flex: 3,
        fontSize: 18,
        color: textGrey,
    },

    weightInfo: {
        flex:2,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: "rgb(72, 235, 181)"
    },

    liftWeight: {
        flex:3,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },

    warmupSets: {
        fontSize: 15,
        color: textGrey,
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

    weightInput:{
        textAlign: "right",
        fontSize: 18,
        color: textGrey,
        fontSize: 18,
        flex:2,
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

    repsText: {
        textAlign: "left",
        fontSize: 17,
        color: textGrey,
        flex: 2,
    },
    infoText:{
        fontSize: 20,
        color: textGrey,
    },
});

module.exports = SetView;

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

class SetView extends Component{
    constructor(props){
        super(props);

        //construct an array of objects for each set we're doing.
        const startliftInfo = this.makeSetsArray(this.props.liftData,"0");

        //update rows if their weight changes. This is when the user puts a new
        //overall weight in and we need to update multiple rows at once.
        var dataSource = new ListView.DataSource(
            {rowHasChanged: (r1,r2) => r1 !== r2}
        );



        if(this.props.liftHistory.length > 0){
            console.log("we found lifts that had been done before.")
            const currentLiftInfo = startliftInfo;
            const currentSetNums = currentLiftInfo.map(l => l.setNum);
            for(let previousSet of this.props.liftHistory){
                //find if it matches a set number we have here.
                if(currentSetNums.includes(previousSet.setNum)){
                    currentLiftInfo.forEach(l => {
                        if(l.setNum === previousSet.setNum){
                            l.userChanged= true
                            l.didIt= true
                        }
                    })
                } else {
                    //this is an extra set in addition to this one, so append it.
                    currentLiftInfo.push(
                        {
                            setNum: previousSet.setNum,
                            reps: previousSet.reps,
                            weight: previousSet.weight,
                            userChanged: true, //know if the user has changed this value so we to update it or not when changing 1rm later.
                            didIt: true,
                            lift: previousSet.lift,
                        }
                    )
                }
            } //end for loop
        } else {
            console.log("this routine has yet to be tried today")
        }

        this.state = {
            setWeight: "0",
            liftInfo: startliftInfo,
            ds: dataSource,
            dataSource: dataSource.cloneWithRows(startliftInfo),
            liftName: this.props.liftName,
            oneLiftLeft: startliftInfo.length === 1,
        }
    }



    makeSetsArray(liftData, weight){
        let liftInfo = [];
        for(let i = 0; i < liftData.sets; i++){
            liftInfo.push(
                {
                    setNum: i + 1,
                    reps: liftData.reps,
                    weight: weight,
                    userChanged: false, //know if the user has changed this value so we to update it or not when changing 1rm later.
                    didIt: false,
                    lift: liftData.name,
                }
            );
        }
        return(liftInfo)
    }

    newSetWeight(inputWeight,setNum){
        let newSetInfo = this.state.liftInfo
        newSetInfo[setNum - 1].weight = inputWeight;
        newSetInfo[setNum - 1].userChanged = true;
        this.updateliftInfo(newSetInfo);
    }

    newRepNum(inputReps,setNum){
        let newSetInfo = this.state.liftInfo
        newSetInfo[setNum - 1].reps = inputReps;
        newSetInfo[setNum - 1].userChanged = true;
        this.updateliftInfo(newSetInfo);
    }

    //when the user puts in a different overall set weight, update the row data accordingly.
    updateLiftWeight(weight){
        this.setState({liftWeight: weight});
        let newSetInfo = this.state.liftInfo;
        //if the user hasnt themselves changed a set's weight, modify it to the new overall weight.
        newSetInfo.forEach(set => set.weight = !set.userChanged? weight: set.weight)
        this.updateliftInfo(newSetInfo);
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


    sendSetInfo(setInfo){
        saveSetInfo(setInfo, this.props.routine)

        let newSetInfo = this.state.liftInfo
        newSetInfo[setInfo.setNum - 1].didIt = true;
        this.updateliftInfo(newSetInfo);
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
        const setNum = setInfo.setNum;
        const repNum = setInfo.reps;
        const weight = setInfo.weight;
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
                            placeholder= {`${repNum}`}
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
                        style = {setInfo.didIt? styles.doneItButton : styles.didItButton}
                        onPress={() => this.sendSetInfo(setInfo)}
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
                        placeholder = {`${this.state.liftName}`}
                        placeholderTextColor = {textBlue}
                        onChangeText = { text => this.newLiftName(text)}
                    />
                    <View style={styles.liftWeight}>
                        <TextInput
                            style={styles.weightInputHeader}
                            keyboardType = 'numeric'
                            placeholder= "set weight"
                            onChangeText = {(text) => this.updateLiftWeight(text)}
                        />
                        <Text style = {styles.poundTextHeader}> lbs </Text>
                    </View>
                </View>
                <ListView
                    dataSource = {this.state.dataSource}
                    renderRow = {this.renderSet.bind(this)}
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

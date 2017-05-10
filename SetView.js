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
import saveSetInfo from './saveSetInfo';

class SetView extends Component{
    constructor(props){
        super(props);

        //construct an array of objects for each set we're doing.
        const startSetsInfo = this.makeSetsArray(this.props.liftData,"0");

        //update rows if their weight changes. This is when the user puts a new
        //overall weight in and we need to update multiple rows at once.
        var dataSource = new ListView.DataSource(
            {rowHasChanged: (r1,r2) => r1 !== r2}
        );

        this.state = {
            setWeight: "0",
            setsInfo: startSetsInfo,
            ds: dataSource,
            dataSource: dataSource.cloneWithRows(startSetsInfo),
            liftName: this.props.liftName,
        }
    }

    makeSetsArray(liftData, weight){
        let setsInfo = [];
        for(let i = 0; i < liftData.sets; i++){
            setsInfo.push(
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
        return(setsInfo)
    }

    newSetWeight(inputWeight,setNum){
        let newSetInfo = this.state.setsInfo
        newSetInfo[setNum - 1].weight = inputWeight;
        newSetInfo[setNum - 1].userChanged = true;
        this.updateSetsInfo(newSetInfo);
    }

    newRepNum(inputReps,setNum){
        let newSetInfo = this.state.setsInfo
        newSetInfo[setNum - 1].reps = inputReps;
        newSetInfo[setNum - 1].userChanged = true;
        this.updateSetsInfo(newSetInfo);
    }

    //when the user puts in a different overall set weight, update the row data accordingly.
    updateLiftWeight(weight){
        this.setState({liftWeight: weight});
        let newSetInfo = this.state.setsInfo;
        //if the user hasnt themselves changed a set's weight, modify it to the new overall weight.
        newSetInfo.forEach(set => set.weight = !set.userChanged? weight: set.weight)
        this.updateSetsInfo(newSetInfo);
    }

    //updates the set info state variable and also the set's given rows.
    updateSetsInfo(newSetInfo){
        this.setState({
            setsInfo: newSetInfo,
            dataSource: this.state.ds.cloneWithRows(newSetInfo)
        });
    }


    sendSetInfo(setInfo){
        saveSetInfo(setInfo, this.props.routine)

        let newSetInfo = this.state.setsInfo
        newSetInfo[setInfo.setNum - 1].didIt = true;
        this.updateSetsInfo(newSetInfo);
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
                            placeholderTextColor = {'#656565'}
                            onChangeText = {(text)=> this.newRepNum(text, setNum)}
                        />
                        <Text style = {styles.repsText}> reps </Text>
                    </View>
                    <View style={styles.weightInfo}>
                        <TextInput
                            style={styles.weightInput}
                            keyboardType = 'numeric'
                            placeholder = {`${weight}`}
                            placeholderTextColor = {'#656565'}
                            onChangeText = {(text)=> this.newSetWeight(text, setNum)}
                        />
                        <Text style = {styles.poundText}> lbs </Text>
                    </View>

                    <TouchableHighlight
                        style = {setInfo.didIt? styles.doneItButton : styles.didItButton}
                        onPress={() => this.sendSetInfo(setInfo)}
                        underlayColor='#dddddd'
                    >
                        <Text style = {styles.poundValue}> {setInfo.didIt? '✓': 'done'} </Text>

                    </TouchableHighlight>
                </View>
                <View style={styles.separator}/>
            </View>
        );
    }

    render(){
        return(
            <View style = {styles.pageContainer}>
                <View style={styles.header}>
                    <Text style={styles.title}>
                        {this.state.liftName}
                    </Text>
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
                    dataSource={this.state.dataSource}
                    renderRow={this.renderSet.bind(this)}
                />
            </View>
        );
    }
}

var styles = StyleSheet.create({
    setRow: {
        flex: 1,
        flexDirection: 'row',
        // padding: 0
        paddingVertical: 6
    },
    setInfo:{
        flex:2,
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
        // backgroundColor: '#3234d5'
    },
    weightInput:{
        textAlign: "right",
        fontSize: 18,
        color: '#656565',
        fontSize: 18,
        flex:2,
    },
    poundText: {
        textAlign: "left",
        fontSize: 17,
        color: '#656565',
        flex: 3,
        // backgroundColor: '#52c729'
    },
    weightInputHeader:{
        textAlign: "right",
        fontSize: 18,
        color: '#656565',
        fontSize: 18,
        flex:4,
    },
    poundTextHeader: {
        textAlign: "left",
        fontSize: 17,
        color: '#656565',
        flex: 1,
        // backgroundColor: '#52c729'
    },

    liftWeight: {
        flex:1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        // backgroundColor: '#c72929'
    },
    liftWeightInput:{
        textAlign: "right",
        fontSize: 18,
        color: '#656565',
        fontSize: 18,
        flex:4,
    },

    didItButton: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#2bcdb1',
        borderColor: '#1da890',
        borderWidth: 1,
        borderRadius: 8,
        alignSelf: 'stretch',
        justifyContent: 'center',
        padding: 5
    },
    doneItButton: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#2b89cd',
        borderColor: '#1da890',
        borderWidth: 1,
        borderRadius: 8,
        alignSelf: 'stretch',
        justifyContent: 'center',
        padding: 5
    },

    repInput:{
        textAlign: "right",
        fontSize: 18,
        color: '#656565',
        fontSize: 18,
        flex:1,
    },
    repsText: {
        textAlign: "left",
        fontSize: 17,
        color: '#656565',
        flex: 2,
    },
    pageContainer:{
        flex: 1
    },
    separator: {
        height: 1,
        backgroundColor: '#dddddd'
    },

    saveButton: {
        height: 36,
        flex: 2,
        flexDirection: 'row',
        backgroundColor: '#2bcdb1',
        borderColor: '#1da890',
        borderWidth: 1,
        borderRadius: 8,
        alignSelf: 'stretch',
        justifyContent: 'center',
        padding: 15,
        textAlign: "center",
    },
    infoText:{
        fontSize: 20,
        color: '#656565',
    },
    header:{
        flexDirection: 'row',
        // backgroundColor: '#ccebc5',
        padding:5,
    },
    title:{
        fontSize: 23,
        fontFamily: "Optima-Bold",
        color: '#3182bd'
    },
    buttonText: {
        fontSize: 18,
        color: 'white',
        alignSelf: 'center'
    },
    saveButton: {
        height: 36,
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#2bcdb1',
        borderColor: '#1da890',
        borderWidth: 1,
        borderRadius: 8,
        alignSelf: 'stretch',
        justifyContent: 'center',
        padding: 15
    },

});

module.exports = SetView;

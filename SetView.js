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


class SetView extends Component{
    constructor(props){
        super(props);

        //construct an array of objects for each set we're doing.
        const liftData = this.props.liftData;
        let setsInfo = this.makeSetsArray(liftData,"");

        var dataSource = new ListView.DataSource(
            {rowHasChanged: (r1,r2) => r1.weight !== r2.weight}
        );

        this.state = {
            oneRepMax: "0",
            setsInfo: setsInfo,
            ds: dataSource,
            dataSource: dataSource.cloneWithRows(setsInfo),
            liftName: this.props.liftName,
        }
    }

    calculateWeight(weight, percentage){
        let setWeight = 0;
        if(!isNaN(weight) && !isNaN(percentage)){
            const rawWeight = weight * (percentage/100);
            setWeight = Math.floor(rawWeight/5)*5;
        }
        return setWeight.toString();
    }

    makeSetsArray(liftData, weight){
        let setsInfo = [];

        for(let i = 0; i < liftData.sets; i++){
            setsInfo.push(
                {
                    setNum: i + 1,
                    reps: liftData.reps,
                    percentage: liftData.percentage,
                    weight: this.calculateWeight(weight, this.props.liftData.percentage),
                    userChanged: false, //know if the user has changed this value so we to update it or not when changing 1rm later.
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
        // console.log(newSetInfo)
    }

    newRepNum(inputReps,setNum){
        let newSetInfo = this.state.setsInfo
        newSetInfo[setNum - 1].reps = inputReps;
        newSetInfo[setNum - 1].userChanged = true;
        this.updateSetsInfo(newSetInfo);
        // console.log(newSetInfo)
    }

    updateOneRepMax(newMax){
        this.setState({oneRepMax: newMax});
        let newSetInfo = this.state.setsInfo;
        newSetInfo.forEach(set => set.weight = this.calculateWeight(newMax, this.props.liftData.percentage))
        this.updateSetsInfo(newSetInfo);
    }

    //updates the set info state variable and also the set's given rows.
    updateSetsInfo(newSetInfo){
        this.setState({
            setsInfo: newSetInfo,
            dataSource: this.state.ds.cloneWithRows(newSetInfo)
        });
    }

    saveToDropbox(){
        console.log(this.state.setsInfo);
    }

    renderSet(setInfo) {
        const setNum = setInfo.setNum;
        const repNum = setInfo.reps;
        const percentage = setInfo.percentage;
        const weight = setInfo.weight;

        return (
            <View>
                <View style={styles.setRow}>
                    <View style = {styles.setInfo}>
                        <Text style={styles.infoText}>
                            Set {setNum}
                        </Text>
                    </View>
                    <View style={styles.reps}>
                        <TextInput
                            style={styles.repInput}
                            keyboardType = 'numeric'
                            placeholder= {`${repNum}`}
                            onChangeText = {(text)=> this.newRepNum(text, setNum)}
                        />
                        <Text style = {styles.poundValue}> reps </Text>
                    </View>
                    <View style={styles.oneRepMax}>
                        <TextInput
                            style={styles.weightInput}
                            keyboardType = 'numeric'
                            placeholder= {`${weight}`}
                            onChangeText = {(text)=> this.newSetWeight(text, setNum)}
                        />
                        <Text style = {styles.poundValue}> lbs </Text>
                    </View>
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
                    <View style={styles.oneRepMax}>
                        <TextInput
                            style={styles.oneRepMaxInput}
                            keyboardType = 'numeric'
                            placeholder= "1 rep max"
                            onChangeText = {(text) => this.updateOneRepMax(text)}
                        />
                        <Text style = {styles.poundValue}> lbs </Text>
                    </View>
                </View>
                <ListView
                    dataSource={this.state.dataSource}
                    renderRow={this.renderSet.bind(this)}
                />
                <View style = {styles.setRow}>
                  <TouchableHighlight style = {styles.saveButton}
                              underlayColor='orangered'
                              onPress={this.saveToDropbox.bind(this)} >
                              <Text style = {styles.buttonText}>Save</Text>
                  </TouchableHighlight>
                </View>
            </View>
        );
    }
}

var styles = StyleSheet.create({

    pageContainer:{
        flex: 1
    },
    setRow: {
        flex: 1,
        flexDirection: 'row',
        padding: 10
    },
    separator: {
        height: 1,
        backgroundColor: '#dddddd'
    },
    setInfo:{
        flex:1
    },
    oneRepMax: {
        flex:1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    oneRepMaxInput:{
        textAlign: "right",
        fontSize: 18,
        color: '#656565',
        fontSize: 18,
        flex:5,
    },
    poundValue: {
        textAlign: "left",
        fontSize: 17,
        color: '#656565',
        flex: 1
    },
    weightInput:{
        textAlign: "right",
        fontSize: 18,
        color: '#656565',
        fontSize: 18,
        flex:2,
    },
    infoText:{
        fontSize: 20,
        color: '#656565',
    },
    header:{
        flexDirection: 'row',
        backgroundColor: '#ccebc5',
        padding:10,
    },
    reps: {
        flex:1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    repInput:{
        textAlign: "right",
        fontSize: 18,
        color: '#656565',
        fontSize: 18,
        flex:1,
    },
    title:{
        fontSize: 30,
        color: '#656565'
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
        backgroundColor: '#48BBEC',
        borderColor: '#48BBEC',
        borderWidth: 1,
        borderRadius: 8,
        // marginBottom: 10,
        alignSelf: 'stretch',
        justifyContent: 'center'
    },
});

module.exports = SetView;

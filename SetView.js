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
        const setsInfo = this.makeSetsArray(liftData,"");

        var dataSource = new ListView.DataSource(
            {rowHasChanged: (r1,r2) => r1.weight !== r2.weight}
        );

        this.state = {
            ds: dataSource,
            dataSource: dataSource.cloneWithRows(setsInfo),
            liftName: this.props.liftName,
        }
    }

    makeSetsArray(liftData, weight){
        const setsInfo = [];

        for(let i = 0; i < liftData.sets; i++){
            setsInfo.push(
                {
                    setNum: i + 1,
                    reps: liftData.reps,
                    percentage: liftData.percentage,
                    weight:this.calculateWeight(weight, liftData.percentage)
                }
            );
        }
        return(setsInfo)
    }

    onTextChanged(text) {

    }
    calculateWeight(weight, percentage){
        let setWeight = 0;
        if(!isNaN(weight) && !isNaN(percentage)){
            const rawWeight = weight * (percentage/100);
            setWeight = Math.floor(rawWeight/5)*5;
        }
        return setWeight;
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
                    <View style = {styles.setInfo}>
                        <Text style={styles.infoText}>
                            {repNum} reps
                        </Text>
                    </View>
                    <View style = {styles.setInfo}>
                        <Text style={styles.infoText}>
                            {weight} lbs
                        </Text>
                    </View>
                    <TextInput
                        style = {styles.repInput}
                        keyboardType = 'numeric'
                        placeholder = "# reps gotten"
                        onChangeText = {(text)=> console.log(text)}
                    />
                </View>
                <View style={styles.separator}/>
            </View>
    );
    }

    updateWeight(text){
        //construct an array of objects for each set we're doing.
        const liftData = this.props.liftData;
        const setsInfo = this.makeSetsArray(liftData,text);

        this.setState({dataSource: this.state.ds.cloneWithRows(setsInfo)})
        console.log(setsInfo)
    }

    render(){
        // console.log(this.state);
        return(
            <View style = {styles.pageContainer}>
                <View style={styles.header}>
                    <Text style={styles.title}>
                        {this.state.liftName}
                    </Text>
                    <TextInput
                        style={styles.repInput}
                        keyboardType = 'numeric'
                        placeholder= "1 rep max"
                        onChangeText = {(text) => this.updateWeight(text)}
                    />
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
    repInput:{
        textAlign: "right",
        fontSize: 18,
        color: '#656565',
        marginRight: 5,
        fontSize: 18,
        flex:1,
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
    title:{
        fontSize: 30,
        color: '#656565'
    }
});

module.exports = SetView;

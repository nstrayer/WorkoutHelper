'use strict';
// list of currently loaded workout templates in the dropbox folder.

import React, { Component } from 'react'
import {
    Text,
    View,
    StyleSheet,
    TouchableHighlight,
} from 'react-native';
import RNFS from 'react-native-fs';

import {colors, mainStyles}  from '../appStyles.js'

class WorkoutButton extends Component{
    constructor(props){
        super(props);
    }

    render(){
        let {routine} = this.props;
        return(
            <View style = {styles.workoutInfo}>
                <TouchableHighlight
                    style = {{backgroundColor: colors.buttonMain}}
                    underlayColor='orangered'
                    onPress={() => this.props.buttonPress(routine)} >
                    <View style = {styles.buttonContent}>
                        <Text style = {[mainStyles.buttonText, styles.leftText]} >
                            {routine.title}
                        </Text>
                        <Text style = {[mainStyles.buttonText,{ fontSize: 12}, styles.leftText]} >
                            {routine.description}
                        </Text>
                    </View>
                </TouchableHighlight>
                <View style = {styles.separator}/>
            </View>
        )
    }
}

var styles = StyleSheet.create({
    leftText:{
        alignSelf: 'flex-start'
    },
    workoutInfo: {
        marginTop: 15,
        marginBottom: 15,
    },
    buttonContent: {
        paddingVertical: 10,
        paddingLeft: 5,
        // backgroundColor: colors.buttonMain
    },
    separator: {
        height: 1,
        backgroundColor: '#dddddd'
    },
});

module.exports = WorkoutButton;

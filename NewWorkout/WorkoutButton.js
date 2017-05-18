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
                <TouchableHighlight style = {mainStyles.button}
                    underlayColor='orangered'
                    onPress={() => console.log(routine.title)} >
                    <View style = {styles.buttonContent}>
                        <Text style = {mainStyles.buttonText} >
                            {routine.title}
                        </Text>
                        <Text style = {[mainStyles.buttonText,{ fontSize: 12}]} >
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
    workoutInfo: {
        marginTop: 15,
        marginBottom: 15,
        backgroundColor: colors.buttonMain
    },
    buttonContent: {
        // paddingVertical: 15,
        backgroundColor: colors.buttonMain
    },
    separator: {
        height: 1,
        backgroundColor: '#dddddd'
    },
});

module.exports = WorkoutButton;

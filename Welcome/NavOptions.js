'use strict';
import React, { Component } from 'react'
import {
    Text,
    TouchableHighlight,
} from 'react-native';
import {colors, mainStyles} from '../appStyles';

import NewWorkout from '../NewWorkout/NewWorkout';

class NavOptions extends Component{
    constructor(props){
        super(props)
    }

    goToWorkout(event){
        if(this.props.token){
            this.props.navigator.push({
                title: "Choose Workout",
                component: NewWorkout,
                passProps: {
                    navigator: this.props.navigator,
                    token: this.props.token}
            });
        }
    }

    render(){
        return(
            <TouchableHighlight style = {mainStyles.button}
                underlayColor='orangered'
                onPress={this.goToWorkout.bind(this)} >
                <Text style = {[mainStyles.buttonText, mainStyles.buttonContent,{alignSelf: 'flex-start'}]}>
                    {this.props.token? "New Workout": "Log in to continue." }
                </Text>
            </TouchableHighlight>
        )
    }
}

module.exports = NavOptions;

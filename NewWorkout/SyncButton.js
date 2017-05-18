import React, { Component } from 'react'
import {
    StyleSheet,
    Text,
    View,
    TouchableHighlight
} from 'react-native';

import {colors, mainStyles}  from '../appStyles.js';

class LogInButton extends Component{

    constructor(props){
        super(props)
    }

    render(){
        return(
            <TouchableHighlight style = {mainStyles.button}
                underlayColor='orangered'
                onPress={() => this.props.onPress()} >
                <Text style = {mainStyles.buttonText}>
                    Sync With Dropbox
                </Text>
            </TouchableHighlight>
        )
    }
}

module.exports = LogInButton;

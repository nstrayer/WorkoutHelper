'use strict';
import React, { Component } from 'react'
import {
    StyleSheet,
    Text,
    View,
} from 'react-native';
import {colors, mainStyles} from '../appStyles';

import NavOptions from './NavOptions';
import LogInButton from './LogInButton';

class WelcomePage extends Component{
    constructor(props){
        super(props);

        this.state = {
            token: null
        };
    }

    //user has logged in and a token has been passed over.
    receivedToken(token){
        this.setState({token: token})
    }

    render(){
        return(
            <View style = {[mainStyles.container, {flexDirection:"column"}]}>
                <View style = {mainStyles.titleWrap}>
                    <Text style = {mainStyles.largeText}>{`It's a good day to lift`}</Text>
                </View>
                <View style = {styles.navigation}>
                    <NavOptions
                        token = {this.state.token}
                        navigator = {this.props.navigator}
                    />
                </View>
                <View style = {styles.logIn}>
                    <LogInButton
                        token = {this.state.token}
                        onLogin = {this.receivedToken.bind(this)}/>
                </View>
            </View>
        )
  }
}

const styles = StyleSheet.create({
    navigation: {
        flex: 3,
        justifyContent: 'center',
    },
    logIn: {
        flex: 1,
        justifyContent: 'center',
    }
});

module.exports = WelcomePage;

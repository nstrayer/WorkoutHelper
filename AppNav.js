'use strict';

import React, { Component } from 'react'
import {
    StyleSheet,
    Text,
    TextInput,
    View,
    TouchableHighlight,
    ActivityIndicator,
    Image,
    AsyncStorage,
    Linking
} from 'react-native';

import WarmupSets from './WarmupSets'
import WorkoutChoose from './WorkoutChoose'
import ApiKey from './Config';
import RNFS from 'react-native-fs';
import downloadFile from './downloadFile';
import saveFile from './saveFile';
import deleteFile from './deleteFile';

class AppNav extends Component{
    constructor(props){
        super(props);
        this.state = {
            loggedIn: false,
            token: null,
        };
    }

    componentDidMount() {
        //uncomment this to simulate a new user.
        // this.removeToken();
        this.checkForToken()
    }

    checkForToken(){
        downloadFile("token")
            .then((token) => {
                console.log("we found a token", token)
                this.setState({
                    token: token,
                    loggedIn: true
                });
            })
            .catch((err) => {
                console.log(err.message, err.code);
            });
    }

    saveToken(token){
        saveFile("token", token)
          .then((success) => {
            console.log('token sent!');
          })
          .catch((err) => {
            console.log(err.message);
          });
    }

    removeToken(){
        deleteFile("token")
          .then((success) => {
            console.log('token deleted!');
          })
          .catch((err) => {
            console.log(err.message);
          });
    }

    grabDropboxToken(ApiKey){
        return new Promise( ( resolve, reject ) => {
            Linking.openURL([
                'https://www.dropbox.com/1/oauth2/authorize',
                '?response_type=token',
                '&client_id=' +  ApiKey ,
                '&redirect_uri=WorkoutLog://foo'
            ].join(''));

            Linking.addEventListener( 'url', handleUrl.bind(this) );

            function handleUrl( event ) {
                const error = event.url.toString().match( /error=([^&]+)/ );
                const code = event.url.toString().match( /code=([^&]+)/ );

                const theToken = event.url
                    .toString()
                    .match(/access_token=(.*)&token_type/)[1];

                this.setState({
                    token: theToken,
                    loggedIn: true
                });
                this.saveToken(theToken);
            }
        } );
    }

    goToWarmups(event){
        this.props.navigator.push({
            title: "Warmup Sets",
            component: WarmupSets,
        });
    }

    goToWorkout(event){
        this.props.navigator.push({
            title: "Choose Workout",
            component: WorkoutChoose,
            passProps: {
                navigator: this.props.navigator,
                token: this.state.token}
        });
    }

    render(){
        let greetingView = this.state.loggedIn ?
        (
            <TouchableHighlight style = {styles.navButton}
                underlayColor='orangered'
                onPress={this.goToWorkout.bind(this)} >
                <Text style = {styles.buttonText}>
                    New Workout
                </Text>
            </TouchableHighlight>
        ) :
        (
            <TouchableHighlight style = {styles.navButton}
                underlayColor='orangered'
                onPress={() => this.grabDropboxToken(ApiKey.ApiKey)} >
                <Text style = {styles.buttonText}>
                    {!this.state.loggedIn? "Log In" : "Logged In"}
                </Text>
            </TouchableHighlight>
        )

        return(
            <View style = {styles.container}>
                <View style = {styles.greetWrap}>
                    <Text style = {styles.greetingText}>It is a good day to Workout</Text>
                    <Text style = {styles.smallerText}>
                        {this.state.loggedIn? "All logged in, let's go":"Log in so your workouts can be saved." }
                    </Text>
                </View>
                <View style = {styles.spacer}/>
                <View style = {styles.buttonWrap}>
                    {greetingView}
                </View>
            </View>
        )
  }
}

const styles = StyleSheet.create({
    container:{
        marginTop: 65,
        flex:1,
        flexDirection: 'column',
    },
    greetWrap: {
        flex: 2,
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    spacer: {
        flex: 1,
    },
    buttonWrap: {
        flex: 2,
        alignSelf:"stretch",
        padding: 40,
        justifyContent: 'center',
        flexDirection: 'row'
    },
    navButton: {
        height: 36,
        flex: 1,
        alignSelf: 'stretch',
        backgroundColor: '#2bcdb1',
        borderColor: '#1da890',
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 10,
        justifyContent: 'center'
    },
    greetingText: {
        fontSize: 24,
        color: '#656565',
    },
    smallerText: {
        fontSize: 18,
        color: '#656565',
    },
    buttonText: {
        fontSize: 18,
        color: 'white',
        alignSelf: 'center'
    },
    loggedIn:{
        height: 36,
        flex: 1,
        flexDirection: 'row',
        backgroundColor: 'orangered',
        borderColor: '#48BBEC',
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 10,
        alignSelf: 'stretch',
        justifyContent: 'center'
    },
});

module.exports = AppNav;

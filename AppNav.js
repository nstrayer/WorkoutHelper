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
    Linking
} from 'react-native';

import WarmupSets from './WarmupSets'
import WorkoutChoose from './WorkoutChoose'
import ApiKey from './Config';

class AppNav extends Component{
    constructor(props){
        super(props);
        this.state = {
            logged_in: false,
            token: null,
        };
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
                    logged_in:true
                });
                console.log(theToken)
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

    return(
      <View style = {styles.container}>
        <Text>It is a good day to Workout</Text>

        <View style = {styles.menuChoice}>
          <TouchableHighlight style = {styles.navButton}
                      underlayColor='orangered'
                      onPress={this.goToWarmups.bind(this)} >
                      <Text style = {styles.buttonText}>Warmup Sets</Text>
          </TouchableHighlight>
        </View>

        <View style = {styles.menuChoice}>
          <TouchableHighlight style = {styles.navButton}
                      underlayColor='orangered'
                      onPress={this.goToWorkout.bind(this)} >
                      <Text style = {styles.buttonText}>New Workout</Text>
          </TouchableHighlight>
        </View>

        <View style = {styles.menuChoice}>
          <TouchableHighlight style = {!this.state.logged_in? styles.navButton : styles.loggedIn}
                      underlayColor='orangered'
                      onPress={() => this.grabDropboxToken(ApiKey.ApiKey)} >
                      <Text style = {styles.buttonText}>
                        {!this.state.logged_in? "Log In" : "Logged In"}
                      </Text>
          </TouchableHighlight>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
    container:{
        padding: 30,
        marginTop: 65,
        alignItems: 'center'
    },
    flowRight: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'stretch'
    },
    buttonText: {
        fontSize: 18,
        color: 'white',
        alignSelf: 'center'
    },
    navButton: {
        height: 36,
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#48BBEC',
        borderColor: '#48BBEC',
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 10,
        alignSelf: 'stretch',
        justifyContent: 'center'
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
    menuChoice: {
      flexDirection: 'row',
      padding: 10
    },
});

module.exports = AppNav;

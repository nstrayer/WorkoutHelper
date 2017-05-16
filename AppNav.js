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

// import WarmupSets from './WarmupSets';
import WorkoutChoose from './WorkoutChoose';
import {
    findToken,
    saveToken,
    deleteToken,
    grabDropboxToken,
} from './tokenTasks';
import {colors, mainStyles} from './appStyles.js'

class AppNav extends Component{
    constructor(props){
        super(props);
        this.state = {
            loggedIn: false,
            token: null,
        };
    }

    componentDidMount() {
        this.checkForToken()
        //uncomment this to simulate a new user.
        // deleteToken()
    }

    async checkForToken(){
        try{
            const userToken = await findToken()

            this.setState({
                token: userToken,
                loggedIn: true
            });
        } catch(error){
            console.log("no token found, moving to plan b")
            const userToken = await grabDropboxToken()

            this.setState({
                token: userToken,
                loggedIn: true
            });

            //same the token also.
            await saveToken(userToken)
        }
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
            <TouchableHighlight style = {mainStyles.button}
                underlayColor='orangered'
                onPress={this.goToWorkout.bind(this)} >
                <Text style = {mainStyles.buttonText}>
                    New Workout
                </Text>
            </TouchableHighlight>
        ) :
        (
            <TouchableHighlight style = {mainStyles.button}
                underlayColor='orangered'
                onPress={() => this.grabDropboxToken(ApiKey.ApiKey)} >
                <Text style = {mainStyles.buttonText}>
                    {!this.state.loggedIn? "Log In" : "Logged In"}
                </Text>
            </TouchableHighlight>
        )

        return(
            <View style = {mainStyles.container}>
                <View style = {styles.greetWrap}>
                    <Text style = {mainStyles.largeText}>It is a good day to Workout</Text>
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
    smallerText: {
        fontSize: 18,
        color: colors.textGrey,
    },
});

module.exports = AppNav;

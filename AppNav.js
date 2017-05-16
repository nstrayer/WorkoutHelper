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
    Linking,
    ScrollView
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
    }

    async logOut(){
        deleteToken()
        this.setState({
            token: null,
            loggedIn: false
        });
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
                    {!this.state.loggedIn? "Log In" : "Log Out"}
                </Text>
            </TouchableHighlight>
        )

        return(
            <View style = {[mainStyles.container, {flexDirection:"column"}]}>
                <View style = {styles.greetWrap}>
                    <Text style = {styles.title}>{`It's a good day to lift`}</Text>
                </View>
                <ScrollView>
                    <View style = {styles.buttonWrap}>
                        <TouchableHighlight style = {mainStyles.button}
                            underlayColor='orangered'
                            onPress={this.goToWorkout.bind(this)} >
                            <Text style = {mainStyles.buttonText}>
                                {this.state.loggedIn? "New Workout":"Log in to continue." }
                            </Text>
                        </TouchableHighlight>
                    </View>
                </ScrollView>

                <View style = {styles.bottom}>
                    <TouchableHighlight style = {mainStyles.button}
                        underlayColor='orangered'
                        onPress={() => {
                            if(this.state.loggedIn){
                                this.logOut()
                            } else {
                                this.checkForToken()
                            }}} >
                        <Text style = {mainStyles.buttonText}>
                            {!this.state.loggedIn? "Log In" : "Log Out"}
                        </Text>
                    </TouchableHighlight>
                </View>
            </View>
        )
  }
}

const styles = StyleSheet.create({
    greetWrap: {
        // flex: 1,
        paddingTop: 15,
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
    title:{
        fontSize: 30,
        color: colors.textBlue,
        fontWeight: "bold",
    },
    bottom:{
        padding: 15,
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0
    },
});

module.exports = AppNav;

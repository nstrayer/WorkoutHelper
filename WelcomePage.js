'use strict';
import React, { Component } from 'react'
import {
    StyleSheet,
    Text,
    View,
    ActivityIndicator,
    TouchableHighlight,
} from 'react-native';
import {colors, mainStyles} from './appStyles';

//for NavOptions component
import WorkoutChoose from './WorkoutChoose';

//for the login button
import {
    findToken,
    saveToken,
    deleteToken,
    grabDropboxToken,
} from './tokenTasks';

class NavOptions extends Component{
    constructor(props){
        super(props)
    }

    goToWorkout(event){
        if(this.props.token){
            this.props.navigator.push({
                title: "Choose Workout",
                component: WorkoutChoose,
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
                <Text style = {mainStyles.buttonText}>
                    {this.props.token? "New Workout": "Log in to continue." }
                </Text>
            </TouchableHighlight>
        )
    }
}

class LogInButton extends Component{

    constructor(props){
        super(props)
    }

    componentDidMount(){
        this.checkForToken()
    }

    async checkForToken(){
        try{
            const token = await findToken()
            this.props.onLogin(token)
        } catch(error){
            console.log("no token found, user has to log in. ")
        }
    }

    async sendToken(){
        try{
            const token = await grabDropboxToken();
            //pass the token back to parent
            this.props.onLogin(token)
            //save token for later use.
            saveToken(token)
        } catch(error){
            console.log(error)
        }
    }

    async logOut(){
        deleteToken()
        this.props.onLogin(null)
    }

    buttonPress(){
        if(this.props.token){
            this.logOut()
        } else {
            this.sendToken()
        }
    }

    render(){
        return(
            <TouchableHighlight style = {mainStyles.button}
                underlayColor='orangered'
                onPress={() => this.buttonPress()} >
                <Text style = {mainStyles.buttonText}>
                    {this.props.token? "Log Out": "Log In"}
                </Text>
            </TouchableHighlight>
        )
    }
}

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
                <View style = {styles.greetWrap}>
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
    greetWrap: {
        flex: 1,
        paddingTop: 15,
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    navigation: {
        flex: 3,
        justifyContent: 'center',
    },
    logIn: {
        flex: 1,
    }
});

module.exports = WelcomePage;

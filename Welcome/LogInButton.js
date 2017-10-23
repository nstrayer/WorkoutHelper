'use strict';
import React, { Component } from 'react'
import {
    Text,
    TouchableHighlight,
} from 'react-native';
import {colors, mainStyles} from '../appStyles';
import {
    findToken,
    saveToken,
    deleteToken,
    grabDropboxToken,
} from '../tokenTasks';


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
        console.log('pressed da button again!!')
        if(this.props.token){
            this.logOut()
        } else {
            this.sendToken()
        }
    }

    render(){
        return(
            <TouchableHighlight style = {mainStyles.buttonAlt}
                underlayColor='orangered'
                onPress={() => this.buttonPress()} >
                <Text style = {[mainStyles.buttonText, mainStyles.buttonContent]}>
                    {this.props.token? "Log Out": "Log In Nao"}
                </Text>
            </TouchableHighlight>
        )
    }
}

module.exports = LogInButton;

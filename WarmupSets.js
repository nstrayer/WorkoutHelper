'use strict';

// Right now this is literally just a wrapper for the warmup sets stuff
// In the future it will be the starting point for the whole app with
// jumping off points for things like which day it is etc.

import React, { Component } from 'react'
import {
    StyleSheet,
    Text,
    TextInput,
    View,
    TouchableHighlight,
    ActivityIndicator,
    Image
} from 'react-native';

// import WarmupSets from './WarmupSets'

var styles = StyleSheet.create({
    container:{
        padding: 30,
        marginTop: 65,
        alignItems: 'center'
    },
    weightInput: {
        height: 36,
        padding: 4,
        marginRight: 5,
        flex: 2,
        fontSize: 18,
        borderWidth: 1,
        borderColor: '#48BBEC',
        borderRadius: 8,
        color: '#48BBEC'
    },
    flowRight: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'stretch'
    },
    description: {
        marginBottom: 20,
        fontSize: 18,
        textAlign: 'center',
        color: 'steelblue'
    },
    buttonText: {
        fontSize: 18,
        color: 'white',
        alignSelf: 'center'
    },
    button: {
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
});

const getWeight = (weight, set_num)=>{
  if(weight === "..."){
    return "...";
  } else if (isNaN(weight)){
    return "that aint a weight"
  } else if (set_num == 1){
    return weight * 0.5;
  } else if (set_num == 2){
    return weight*0.75;
  } else {
    return weight*0.9;
  }
}

const getReps = (set_num)=>{
  if(set_num == 0){
    return "10 reps"
  } else if (set_num == 1) {
    return "6 reps"
  } else if (set_num == 2) {
    return "3 reps"
  } else if (set_num == 3) {
    return "1-2 reps"
  } else {
    return "I'm confused"
  }
}

const makeSetMessage = (weight, set_num)=>{
  const curr_weight = getWeight(weight, set_num);
  const  curr_reps  = getReps(set_num);
  return (
    <Text style = {styles.textStyle}>
      {curr_weight} for {curr_reps} reps
    </Text>
  );
}

class WarmupSets extends Component {

    constructor(props) {
        super(props);
        this.state = {
            weight: "200",
        };
    }

    onWeightTextChange(event){
        this.setState({weight:event.nativeEvent.text});
    }

    onCalculatePress(){

    }

    render() {

        return (
            <View style = {styles.container}>
                <Text style = {styles.description}>
                    Enter your work-set weight:
                </Text>
                <View style={styles.flowRight}>
                    <TextInput
                        style = {styles.weightInput}
                        value = {this.state.weight}
                        onChange = {this.onWeightTextChange.bind(this)}
                        placeholder='a trillion pounds' />
                    <TouchableHighlight style = {styles.button}
                        underlayColor='orangered'
                        onPress={this.onCalculatePress.bind(this)} >
                        <Text style = {styles.buttonText}>Calculate</Text>
                    </TouchableHighlight>
                </View>

                <View style={styles.flowRight}>
                  {makeSetMessage(this.state.weight, 1)}
                </View>
                <View style={styles.flowRight}>
                  {makeSetMessage(this.state.weight, 2)}
                </View>
                <View style={styles.flowRight}>
                  {makeSetMessage(this.state.weight, 3)}
                </View>
              </View>

        );
    }
}

//send out what we just made so it can be imported.
module.exports = WarmupSets;

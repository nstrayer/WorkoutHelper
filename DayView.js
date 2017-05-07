'use strict';

// View a single day of a routine.
// Lists lifts in order with an indented list of the individual sets below them

import React, { Component } from 'react'
import {
    StyleSheet,
    Text,
    TextInput,
    View,
    TouchableHighlight,
    ActivityIndicator,
    ListView,
    Image
} from 'react-native';
import SetView from './SetView';

class DayView extends Component{
    constructor(props){
        super(props);

        var dataSource = new ListView.DataSource(
            {rowHasChanged: (r1,r2) => r1.name !== r2.name}
        );

        this.state = {
            dataSource: dataSource.cloneWithRows(this.props.lifts),
            selected: true,
            dayID: this.props.id,
        }
    }

    renderLift(liftData) {
      const liftName = liftData.name;

      return (
        <View>
            <View style={styles.liftSets}>
                <SetView liftName = {liftName} liftData = {liftData}/>
            </View>
        </View>
      );
    }

    render(){
        return(
            <View style = {styles.pageContainer}>
                <ListView
                    dataSource={this.state.dataSource}
                    renderRow={this.renderLift.bind(this)}
                />
            </View>
        )
    }
}

var styles = StyleSheet.create({

    pageContainer:{
        flex: 1
    },
    resultsList: {
        marginBottom: 20,
        fontSize: 18,
        textAlign: 'center',
        color: 'steelblue'
    },
    rowContainer: {
        flexDirection: 'column',
    },
    separator: {
        height: 1,
        backgroundColor: '#dddddd'
    },
    liftName:{
        flex: 1,
        backgroundColor: '#ccebc5',
        padding:10,
    },
    liftSets:{
        flex:1,
        // padding:10,
        backgroundColor: '#b3cde3',
    },
    title:{
        fontSize: 30,
        color: '#656565'
    }
});

module.exports = DayView;

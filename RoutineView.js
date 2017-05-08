'use strict';

//Takes a json object defining a routine and displays a list of the days for selection

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
import DayView from './DayView';

class RoutineView extends Component{
    constructor(props){
        super(props);

        var dataSource = new ListView.DataSource(
            {rowHasChanged: (r1,r2) => r1.id !== r2.id}
        );

        this.state = {
            dataSource: dataSource.cloneWithRows(this.props.routineData.days),
            title: this.props.routineData.title,
        }
    }

    renderDay(routineData) {
      const dayID = routineData.id;
      const lifts = routineData.lifts.map(l => l.name).join(", ");

      return (
        <TouchableHighlight
            onPress={() => this.goToDay(routineData)}
            underlayColor='#dddddd'
        >
            <View>
                <View style={styles.rowContainer}>
                    <View style={styles.textContainer}>
                        <Text style={styles.title}>
                            Day {dayID}
                        </Text>
                        <Text>
                            {lifts}
                        </Text>
                    </View>
                </View>
                <View style={styles.separator}/>
            </View>
        </TouchableHighlight>
      );
    }

    goToDay(routineData){
        console.log(routineData)
        this.props.navigator.push({
          title: `Day ${routineData.id}`,
          component: DayView,
          passProps: {
              id: routineData.id,
              lifts: routineData.lifts,
              navigator: this.props.navigator,
              dbConnection: this.props.dbConnection
          }
        });
    }

    render(){
        return(
            <View style = {styles.days}>
                <Text style = {styles.title}>
                    {this.state.title}
                </Text>
                <ListView
                    dataSource={this.state.dataSource}
                    renderRow={this.renderDay.bind(this)}
                />
            </View>
        );
    }
}

var styles = StyleSheet.create({

    days:{
        flex: 1
    },
    resultsList: {
        marginBottom: 20,
        fontSize: 18,
        textAlign: 'center',
        color: 'steelblue'
    },
    rowContainer: {
        flexDirection: 'row',
        padding: 10
    },
    separator: {
        height: 1,
        backgroundColor: '#dddddd'
    },
    title: {
        fontSize: 20,
        color: '#656565'
    },
});

module.exports = RoutineView;

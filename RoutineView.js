'use strict';
//Takes a json object defining a routine and displays a list of the days for given routine

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
import {colors, mainStyles}  from './appStyles.js'
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

    goToDay(routineData){
        this.props.navigator.push({
            title: `Day ${routineData.id}`,
            component: DayView,
            passProps: {
                routine: this.state.title,
                id: routineData.id,
                lifts: routineData.lifts,
                navigator: this.props.navigator
            }
        });
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
                            <Text style={mainStyles.boldTitle}>
                                Day {dayID}
                            </Text>
                            <Text style={mainStyles.description}>
                                {lifts}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.separator}/>
                </View>
            </TouchableHighlight>
        );
    }

    routineName(){
        return(
            <View>
                <Text style = {[mainStyles.largeText, mainStyles.centerTitle]}>
                    {this.state.title}
                </Text>
            </View>
        )
    }

    render(){
        return(
            <View style = {[mainStyles.container, mainStyles.padded]}>
                <ListView
                    dataSource={this.state.dataSource}
                    renderRow={this.renderDay.bind(this)}
                    renderHeader={this.routineName.bind(this)}
                />
            </View>
        );
    }
}

var styles = StyleSheet.create({
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
        color: colors.textBlue
    },
});

module.exports = RoutineView;

'use strict';
// list of currently loaded workout templates in the dropbox folder.

import {colors, mainStyles}  from './appStyles.js'
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
import RoutineView from './RoutineView';
import RNFS from 'react-native-fs';

class RoutineList extends Component{
    constructor(props){
        super(props);

        let dataSource = new ListView.DataSource(
            {rowHasChanged: (r1,r2) => r1.title !== r2.title}
        );

        this.state = {
            dataSource: dataSource.cloneWithRows(this.props.workouts)
        };
    }

    renderWorkout(workoutData) {
        const name = workoutData.title;
        const description = workoutData.description;

        return (
            <TouchableHighlight
                onPress={() => this.goToRoutine(workoutData)}
                underlayColor='#dddddd' >
                <View>
                    <View style={styles.rowContainer}>
                        <View style={styles.textContainer}>
                            <Text style={mainStyles.boldTitle}>
                                {name}
                            </Text>
                            <Text style={mainStyles.description}>
                                {description}
                            </Text>
                        </View>
                    </View>
                <View style={styles.separator}/>
                </View>
            </TouchableHighlight>
        );
    }


    goToRoutine(routineData){
        //navigate to the routine in app.
        this.props.navigator.push({
            title: "Routine",
            component: RoutineView,
            passProps: {
                routineData: routineData,
                navigator: this.props.navigator
            }
        });
    }

  render(){
    //display the dropbox list normally, but a loading icon if we're downloading a routine.
    return !this.state.downloadingRoutine?
        (
            <View>
                <ListView
                    dataSource={this.state.dataSource}
                    renderRow={this.renderWorkout.bind(this)}
                />
            </View>
        ):
        (
            <View>
                <Text>Downloading</Text>
                <ActivityIndicator size='large'/>
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
});

module.exports = RoutineList;

'use strict';

// list of currently loaded workout templates in the dropbox folder.

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
import DownloadJSON from './DownloadJSON'

class RoutineList extends Component{
  constructor(props){
    super(props);

    let dataSource = new ListView.DataSource(
      {rowHasChanged: (r1,r2) => r1.name !== r2.name}
    );

    //get rid of the results datasets we've saved.
    const routines = this.props.dbresponse.entries.filter(r => r.name.includes(".json"));

    this.state = {
        dataSource: dataSource.cloneWithRows(routines),
        dbConnection: this.props.dbConnection,
        downloadingRoutine: false,
    };
  }

  renderWorkout(workoutData) {
    const name = workoutData.name.split('.')[0].replace(/_/g, " ");
    const pathAdress = workoutData.path_display;

    return (
        <TouchableHighlight
            onPress={() => this.downloadRoutine(pathAdress)} underlayColor='#dddddd'
        >
            <View>
                <View style={styles.rowContainer}>
                    <View style={styles.textContainer}>
                        <Text style={styles.title}>
                            {name}
                        </Text>
                    </View>

                </View>
                <View style={styles.separator}/>
            </View>
        </TouchableHighlight>
    );
  }

    downloadRoutine(filePath){
        const localPath = RNFS.DocumentDirectoryPath + filePath;

        DownloadJSON(filePath, this.props.token)
            .promise
            .then((response) => {
                if (response.statusCode == 200) {
                    console.log('FILES Downloaded!')
                    return RNFS.readFile(localPath, 'utf8')
                } else {
                    console.log('SERVER ERROR')
                }
            })
            .then((contents) => this.readRoutine(contents))
            .catch((err) => console.log(err.message, err.code) );

    }

    readRoutine(contents){
        const workoutParsed = JSON.parse(contents);
        this.setState({downloadingRoutine: false});

        //navigate to the routine in app.
        this.props.navigator.push({
            title: "Routine",
            component: RoutineView,
            passProps: {routineData: workoutParsed,
                        navigator: this.props.navigator,
                        dbConnection: this.props.dbConnection}
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
    resultsList: {
      marginBottom: 20,
      fontSize: 18,
      textAlign: 'center',
      color: '#80b1d3'
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

module.exports = RoutineList;

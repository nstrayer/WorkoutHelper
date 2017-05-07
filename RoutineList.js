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

class RoutineList extends Component{
  constructor(props){
    super(props);

    var dataSource = new ListView.DataSource(
      {rowHasChanged: (r1,r2) => r1.name !== r2.name}
    );

    this.state = {
        dataSource: dataSource.cloneWithRows(this.props.dbresponse.entries),
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
        this.setState({downloadingRoutine: true});

        const dbx = this.state.dbConnection;
        dbx.filesDownload({path: filePath})
            .then((response) => {
                this.readFileBlob(response.fileBlob);
            })
            .catch(function(error) {
                console.log(error);
            });
    }

    readFileBlob(blob){
        var fileReader = new FileReader();
        fileReader.onload = () => {
            const workoutRaw = fileReader.result; // store the file contents
            const workoutParsed = JSON.parse(workoutRaw);
            console.log(workoutParsed);
            //finished downloading
            this.setState({downloadingRoutine: false});
            //navigate to the routine in app.
            this.props.navigator.push({
                title: "Routine",
                component: RoutineView,
                passProps: {routineData: workoutParsed,
                            navigator: this.props.navigator}
            });
        };
        fileReader.readAsText(blob);
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

module.exports = RoutineList;

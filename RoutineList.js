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

class RoutineList extends Component{
  constructor(props){
    super(props);

    var dataSource = new ListView.DataSource(
      {rowHasChanged: (r1,r2) => r1.name !== r2.name}
    );
    this.state = {
        dataSource: dataSource.cloneWithRows(this.props.dbresponse.entries)
    };
  }

  renderWorkout(workoutData) {
    var name = workoutData.name.split('.')[0];
    return (
        <TouchableHighlight
            onPress={() => console.log('clicked me')} underlayColor='#dddddd'
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

  render(){
    console.log(this.props.dbresponse.entries);
    return (
      <ListView
          dataSource={this.state.dataSource}
          renderRow={this.renderWorkout.bind(this)}/>
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

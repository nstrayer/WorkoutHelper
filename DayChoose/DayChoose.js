"use strict";
//Takes a json object defining a routine and displays a list of the days for given routine

import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableHighlight,
  ActivityIndicator,
  ListView,
  Image,
  FlatList,
} from "react-native";
import { colors, mainStyles } from "../appStyles.js";
import DayInfo from "./DayInfo";
import DayView from "../DayView";

class DayChoose extends Component {
  constructor(props) {
    super(props);
  }

  goToDay(dayData) {
    let { lifts, id } = dayData;
    let { routine, navigator } = this.props;

    this.props.navigator.push({
      title: `Day ${id}`,
      component: DayView,
      passProps: {
        routine: routine.title,
        id: id,
        lifts: lifts,
        navigator: navigator
      }
    });
  }

  render() {
    let { title, description, days } = this.props.routine;
    return (
      <View style={[mainStyles.container, { flexDirection: "column" }]}>
        <View style={mainStyles.titleWrap}>
          <Text style={mainStyles.largeText}>{title}</Text>
        </View>
        <View style={styles.navigation}>
            <FlatList
            data={days}
            renderItem={({ item: day }) => (
                <DayInfo key={day.id} dayData={day} onPress={this.goToDay.bind(this)} />
            )}
            />
        </View>
      </View>
    );
  }
}

var styles = StyleSheet.create({
  navigation: {
    flex: 8
  }
});

module.exports = DayChoose;

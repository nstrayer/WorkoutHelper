"use strict";

import React, { Component } from "react";
import { StyleSheet, Text, View, TouchableHighlight } from "react-native";
import { colors, mainStyles } from "../appStyles.js";

class DayInfo extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let { id: title, lifts } = this.props.dayData;
    const liftsList = lifts.map(l => l.name).join(", ");

    return (
      <View style={styles.dayInfo}>
        <TouchableHighlight
          style={styles.buttonContent}
          underlayColor="orangered"
          onPress={() => this.props.onPress(this.props.dayData)}
        >
          <View style={styles.buttonContent}>
            <Text style={[mainStyles.buttonText, styles.leftText]}>
              {title}
            </Text>
            <Text
              style={[mainStyles.buttonText, { fontSize: 12 }, styles.leftText]}
            >
              {liftsList}
            </Text>
          </View>
        </TouchableHighlight>
      </View>
    );
  }
}

var styles = StyleSheet.create({
  leftText: {
    alignSelf: "flex-start"
  },
  dayInfo: {
    paddingVertical: 2
  },
  buttonContent: {
    paddingVertical: 10,
    paddingLeft: 5,
    backgroundColor: colors.buttonMain
  }
});

module.exports = DayInfo;

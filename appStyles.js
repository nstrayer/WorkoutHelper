'use strict';
import { StyleSheet } from 'react-native';

// A set of main styles for the app
const colors = {
    buttonMain: "#368cc7",
    buttonMainOutline: "#a6cee3",
    buttonDone: "#33a02c",
    buttonDoneOutline: "#b2df8a",
    buttonDisabled: "#bdbdbd",
    buttonDisabledOutline: "#636363",
    buttonText: "white",
    textGrey: "#6c6a6a",
    textBlue :"#1f78b4",
}

const mainStyles = StyleSheet.create({
    container:{                  //a holder for pretty much everything.
        marginTop: 60,           //this buffer makes sure stuff isnt obscured by the navigation bar
        flex:1,
        flexDirection: 'column',
    },
    button: {
        height: 36,
        flex: 1,
        alignSelf: 'stretch',
        backgroundColor: colors.buttonMain,
        borderColor: colors.buttonMainOutline,
        borderWidth: 1,
        borderRadius: 5,
        // marginBottom: 10,
        justifyContent: 'center'
    },
    buttonText: {
        fontSize: 18,
        color: colors.buttonText,
        alignSelf: 'center'
    },
    largeText: {
        fontSize: 24,
        color: colors.textBlue,
    },
    boldTitle: {
      fontSize: 20,
      fontWeight: "bold",
      color: colors.textGrey
    },
    description: {
        fontSize: 14,
        color: colors.textGrey
    },
    mediumText:{
        fontSize: 18,
        color: colors.textGrey
    },
    padded: {
        padding: 15,
    },
    centerTitle:{
        textAlign: 'center'
    },
    separator: {
        height: 1,
        backgroundColor: '#dddddd'
    },
});

module.exports = {
    colors,
    mainStyles
};

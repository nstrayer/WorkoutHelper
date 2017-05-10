'use strict'

// Takes an setInfo object and a routine name and appends the object to
// the given routine's results file.

import RNFS from 'react-native-fs';
import downloadFile from './downloadFile';
import deleteFile from './deleteFile';
import saveFile from './saveFile';

const saveSetInfo = (setInfo, routineName) => {

    const date = new Date();
    const dateClean = `${date.getMonth()}-${date.getDate()}-${date.getFullYear()}`;
    const time = `${date.getHours()}:${date.getMinutes()}`;
    const newResults = {
        lift: setInfo.lift,
        weight: setInfo.weight,
        reps: setInfo.reps,
        setNum: setInfo.setNum,
        date: dateClean,
        time: time,
        notes: "lots of notes",
        routine: routineName
    };
    console.log("appending info to the result file...");
    console.log(newResults);

    //first download the old results file, grab the data, append our new data to it
    //then reupload the results with the new data appended.
    // Future: if we have the same set number for the same lift on the same day, replace with the new one.
    let results;

    downloadFile(`liftHistory.csv`)
        .then(oldResults => {
            results = JSON.parse(oldResults);
            results.push(newResults)
            return deleteFile(`liftHistory.csv`)
        })
        .then(result => {
            return saveFile(`liftHistory.csv`, JSON.stringify(results))
        })
        .then(results => console.log("updated the lift history file with new data"))
        .catch(error => console.log(error))
}

module.exports = saveSetInfo;

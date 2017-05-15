'use strict'

// Takes an setInfo object and a routine name and appends the object to
// the given routine's results file.

import RNFS from 'react-native-fs';
import downloadFile from './downloadFile';
import deleteFile from './deleteFile';
import saveFile from './saveFile';
import getDateTime from './getDateTime';

const saveSetInfo = async (setInfo, liftName, routineName) => {

    const {date, time} = getDateTime()
    const {weight, reps, setNum, difficulty} = setInfo[0];
    const newResults = {
        lift:       liftName,
        weight:     weight,
        reps:       reps,
        setNum:     setNum,
        difficulty: difficulty,
        date:       date,
        time:       time,
        notes:      "lots of notes",
        routine:    routineName,
    };

    //first download the old results file, grab the data, append our new data to it
    //then reupload the results with the new data appended.
    // Future: if we have the same set number for the same lift on the same day, replace with the new one.

    const oldResults = await downloadFile(`liftHistory.csv`)

    console.log(oldResults)

    let results = JSON.parse(oldResults);
    results.push(results)

    await deleteFile(`liftHistory.csv`)

    await saveFile(`liftHistory.csv`, JSON.stringify(results))

    console.log("updated the lift history file with new data")
}

module.exports = saveSetInfo;

'use strict';

// Updates the lift history records with newly provided history

import RNFS from 'react-native-fs';
import downloadFile from './fsHelpers/downloadFile';
import deleteFile from './fsHelpers/deleteFile';
import saveFile from './fsHelpers/saveFile';

async function updateHistory(newRecords){
    let results = JSON.parse(await downloadFile(`liftHistory.csv`))

    //add new results
    results.push(newRecords)

    await saveFile(`liftHistory.csv`, JSON.stringify(results))

    return results;
}

module.exports = updateHistory;

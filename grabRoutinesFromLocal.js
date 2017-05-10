'use strict';
import RNFS from 'react-native-fs';
import downloadFile from './downloadFile';

// Takes a list of local workouts in json
// then parses them to an array of objects

const grabRoutinesFromLocal = (fileNames) => {
    console.log(fileNames)
    Promise.all(fileNames.map(file => downloadFile(file)))
        .then(data => console.log(data))
        .catch(error => "couuldnt read, uh oh")
}

module.exports = grabRoutinesFromLocal

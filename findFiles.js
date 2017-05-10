'use strict';
import RNFS from 'react-native-fs';


// Gets a list of files with a specific type.
// Aka get me all the json files, or all the csvs.

const findFiles = (type) => {
    const filePromise = RNFS.readDir(`${RNFS.DocumentDirectoryPath}`)
        .then( result => {
            const matchingFiles = result.filter(r => r.name.includes(type));
            if(matchingFiles.length === 0){
                console.log("no files found.")
                return Promise.all([]);
            } else {
                //get the names of the applicable files.
                const names = matchingFiles.map(f => f.name);
                //return two things. First will make sure the found file is truly a file and the second is where the file is.
                return Promise.all(names);
            }
        })
    return filePromise;
}

module.exports = findFiles;

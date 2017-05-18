'use strict';
import RNFS from 'react-native-fs';

// Checks for a file of a given name. If it finds one it returns a promise that
// will return the files contents.

const downloadFile = (fileName) => {
    const filePromise = RNFS.readDir(RNFS.DocumentDirectoryPath)
        .then( result => {
            const matchingFiles = result.filter(r => r.name === fileName);
            if(matchingFiles.length === 0){
                console.log("no files found.")
                return 'no files found!';
            } else {
                //return two things. First will make sure the found file is truly a file and the second is where the file is.
                return Promise.all([RNFS.stat(matchingFiles[0].path), matchingFiles[0].path]);
            }
        })
        .then( fileResult => {
            // Check to make sure we actually have a file.
            if (fileResult[0].isFile()) {
              return RNFS.readFile(fileResult[1], 'utf8') ;
            }
            return new Promise('no file!');
        });

    return filePromise;
}

module.exports = downloadFile;

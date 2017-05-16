'use strict'
// finds and returns a list available files with given directory and ending

import RNFS from 'react-native-fs';

async function findFiles(type, directory = ""){
    const pathToSearch = `${RNFS.DocumentDirectoryPath}${directory}`
    const allAvailableFiles = await RNFS.readDir(pathToSearch)

    const matchingFiles = allAvailableFiles.filter(file => file.name.includes(type));

    if(matchingFiles.length === 0){
        console.log("no files found.")
        return [];
    } else {
        //get the names of the applicable files.
        const names = matchingFiles.map(f => f.name);
        //return two things. First will make sure the found file is truly a file and the second is where the file is.
        return names;
    }
}

module.exports = findFiles;

'use strict';
import RNFS from 'react-native-fs';

// Given a file name and stringed value, save to the local file system
// Currently everything gets dumped in the main directory. Perhaps not the best but oh well.
// Like checkForFile() it also returns a promise.

const saveFile = (fileName, content) => {
    // create a path you want to write to
    const localPath = `${RNFS.DocumentDirectoryPath}/${fileName}`;

    // write the file
    return RNFS.writeFile(localPath, content, 'utf8');
}

module.exports = saveFile;

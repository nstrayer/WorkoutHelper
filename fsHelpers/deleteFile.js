`use strict`;
import RNFS from 'react-native-fs';

// Take a file path and delete the file there. Good for refreshing tokens etc
// Once again, returns a promise.

const deleteFile = (fileName) => {
    // create a path you want to write to
    const localPath = `${RNFS.DocumentDirectoryPath}/${fileName}`;

    return RNFS.unlink(localPath)
}

module.exports = deleteFile;

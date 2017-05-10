'use strict';
import RNFS from 'react-native-fs';

//give a path of a dropbox json routine to download and it will put it into local storage.

const downloadRoutine = (dbPath, fileName, token) => {
    const localPath = `${RNFS.DocumentDirectoryPath}/${fileName}`;
    return (
        RNFS.downloadFile({
            fromUrl: "https://content.dropboxapi.com/2/files/download",
            toFile: localPath,
            headers: {
                "Authorization": "Bearer " +  token,
                "Dropbox-API-Arg": JSON.stringify({path: dbPath})
            }
        })
    )
}

module.exports = downloadRoutine

'use strict';
import RNFS from 'react-native-fs';
import {token} from '../Config';
//give a path of a dropbox json routine to download and it will put it into local storage.

const downloadHistory = (dbPath, fileName) => {

    console.log("Downloading previous workout history to check for this routine being run today already")
    // const localPath = `${RNFS.DocumentDirectoryPath}/${fileName}`;
    // return (
    //     RNFS.downloadFile({
    //         fromUrl: "https://content.dropboxapi.com/2/files/download",
    //         toFile: localPath,
    //         headers: {
    //             "Authorization": "Bearer " +  token,
    //             "Dropbox-API-Arg": JSON.stringify({path: dbPath})
    //         }
    //     })
    // )
}

module.exports = downloadHistory

'use strict';

// Goes onto my (Nick) dropbox and pulls down all the current routines,
// then saves those to the routine data in the device

// Takes a local results file and uploads it to dropbox
import RNFS from 'react-native-fs';
import downloadFile from './downloadFile';
import Dropbox from 'dropbox';
import {nicksToken} from './Config.js'

//Returns a promise that will download the stuffs.
const DownloadJSON = (fileInfo, token) => {
    const localPath = `${RNFS.DocumentDirectoryPath}/${fileInfo.name}`;
    const dbPath = fileInfo.path_display;
    console.log("downloading", dbPath)
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

//finds files availible in the routines section of dropbox,
//then downloads those to local storage
//Returns a promise that will either work or not.
const downloadRoutines = () => {
    console.log("running download routines!")
    var dbx = new Dropbox({ accessToken: nicksToken });

    return dbx.filesListFolder({path: '/routines'})
        .then(response => {
            console.log("these are the files we found in your dropbox routines folder", response)
            const downloadPromises = response.entries
                .map(routineInfo => DownloadJSON(routineInfo, nicksToken))
            return Promise.all(downloadPromises);
        })//we get back a series of the routines and their data.
        // .then(routineData => {
        //     console.log("we found your routines and downloaded them");
        // })
        // .catch(function(error) {
        //   console.log(error);
        // });
}

module.exports = downloadRoutines;

'use strict';

import RNFS from 'react-native-fs';
// some helpers for downloading files from dropbox

//Returns a promise that will download the stuffs.
const DownloadJSON = (dbLocation, token) => {
    //give local file the same name as dropbox one for syncing reasons.
    const localPath = `${RNFS.DocumentDirectoryPath}/${dbLocation}`;

    return (
        RNFS.downloadFile({
        fromUrl: "https://content.dropboxapi.com/2/files/download",
        toFile: localPath,
        headers: {
            "Authorization": "Bearer " +  token,
            "Dropbox-API-Arg": JSON.stringify({path: dbLocation})
        }
    })
    )
}

module.exports = DownloadJSON;

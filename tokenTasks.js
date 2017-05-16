'use strict';
import {Linking} from 'react-native';
import {ApiKey} from './Config';
import RNFS from 'react-native-fs';
import downloadFile from './downloadFile';
import saveFile from './saveFile';
import deleteFile from './deleteFile';

// anything one could desire to do with a dropbox token, right here.

async function findToken(){
    const token = await downloadFile("token");
    return(token)
}

async function saveToken(token){
    try{
        await saveFile("token", token)
    } catch(error){
        console.log(error.message);
    }
}

async function deleteToken(){
    try{
        await deleteFile("token")
    } catch(error){
        console.log(error.message);
    }
}

function goGrabKey(){
    return new Promise( ( resolve, reject ) => {
        Linking.openURL([
            'https://www.dropbox.com/1/oauth2/authorize',
            '?response_type=token',
            '&client_id=' +  ApiKey ,
            '&redirect_uri=WorkoutLog://foo'
        ].join(''));

        Linking.addEventListener( 'url', handleUrl.bind(this) );

        function handleUrl( event ) {
            const error = event.url.toString().match( /error=([^&]+)/ );
            const code = event.url.toString().match( /code=([^&]+)/ );

            const theToken = event.url
                .toString()
                .match(/access_token=(.*)&token_type/)[1];

            resolve(theToken)
        }
    } );
}

async function grabDropboxToken() {

    const newToken = await goGrabKey()

    return(newToken)
}

module.exports = {
    findToken,
    saveToken,
    deleteToken,
    grabDropboxToken,
}

'use strict';
import React, { Component } from 'react'
import { Linking } from 'react-native';
// A helpful function for grabbing authentication details from dropbox and returning
// the token as a string

const DropboxLogin = (ApiKey) => {
    return new Promise( ( resolve, reject ) => {
        Linking.openURL([
            'https://www.dropbox.com/1/oauth2/authorize',
            '?response_type=token',
            '&client_id=' +  ApiKey ,
            '&redirect_uri=WorkoutLog://foo'
        ].join(''));

        Linking.addEventListener( 'url', handleUrl );

        function handleUrl( event ) {
            const error = event.url.toString().match( /error=([^&]+)/ );
            const code = event.url.toString().match( /code=([^&]+)/ );

            const theToken = event.url
                .toString()
                .match(/access_token=(.*)&token_type/)[1];

            console.log(theToken)
        }
    } );
}

module.exports = DropboxLogin;

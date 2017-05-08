'use strict';

// A helpful function for grabbing authentication details from dropbox and returning
// the token as a string

export function DropboxLogin(ApiKey) {
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

            console.log(event.url)
        }
    } );
}

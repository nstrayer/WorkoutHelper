'use strict'

// Takes a dropbox token and tells me a list of routines available.
import Dropbox from 'dropbox';
import {token} from '../Config';

const listAvailableRoutines = () => {
    var dbx = new Dropbox({ accessToken: token });
    return dbx.filesListFolder({path: '/routines'})
}

module.exports = listAvailableRoutines;

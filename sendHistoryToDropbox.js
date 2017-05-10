'use strict';

// Takes a local results file and uploads it to dropbox
import downloadFile from './downloadFile';
import Dropbox from 'dropbox';


const sendHistoryToDropbox = () => {
    // First we turn the history json into a csv using a map function
    let historyCSV //holder that we will fill in a promise later.

    return downloadFile(`liftHistory.csv`)
        .then(results => {
            const history = JSON.parse(results);

            //get rid of the starter row.
            history.shift()

            //add a header row and merge into a single string and put in initialized historyCSV variable.
            historyCSV = [`lift, weight, reps, setNumber, date, time, notes, routine`]
                .concat(
                    history.map(s => `${s.lift}, ${s.weight}, ${s.reps}, ${s.setNum}, ${s.date}, ${s.time}, ${s.notes}, ${s.routine}`)
                )
                .join("\n");

            return downloadFile("token");
        }) //Grab our dropbox token from storage
        .then(token => {
            var dbx = new Dropbox({ accessToken: token });
            return dbx.filesUpload({
                contents: historyCSV,
                path: '/liftHistory.csv',
                mode: 'overwrite',
                autorename: true,
                mute: false })
        })
}

module.exports = sendHistoryToDropbox;

'use strict';

// Takes a local results file and uploads it to dropbox
import downloadFile from '../downloadFile';
import Dropbox from 'dropbox';


const sendHistoryToDropbox = async () => {
    // First we turn the history json into a csv using a map function

    const localHistory = await downloadFile(`liftHistory.csv`);

    let parsedHistory = JSON.parse(localHistory);

    //get rid of the starter row.
    parsedHistory.shift()

    //add a header row and merge into a single string and put in initialized historyCSV variable.
    const historyCSV = [`lift, weight, reps, setNumber, date, time, notes, routine`]
        .concat(
            parsedHistory
                .map(s => `${s.lift}, ${s.weight}, ${s.reps}, ${s.setNum}, ${s.date}, ${s.time}, ${s.notes}, ${s.routine}`)
        )
        .join("\n");

    //grab user's dropbox token
    const dbToken = await downloadFile("token");

    //start a new dropbox api connection
    var dbx = new Dropbox({ accessToken: dbToken });

    //send the new lift data up to dropbox.
    await dbx.filesUpload({
                contents: historyCSV,
                path: '/liftHistory.csv',
                mode: 'overwrite',
                autorename: true,
                mute: false
            });

    return 'finished uploading';
}

module.exports = sendHistoryToDropbox;

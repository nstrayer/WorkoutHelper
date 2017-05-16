'use strict';

// Takes a local results file and uploads it to dropbox
import downloadFile from '../fsHelpers/downloadFile';
import Dropbox from 'dropbox';


const sendHistoryToDropbox = async () => {
    // First we turn the history json into a csv using a map function

    let history = JSON.parse(await downloadFile(`liftHistory.csv`));

    //add a header row and merge into a single string and put in initialized historyCSV variable.
    const historyCSV = [`lift, weight, reps, difficulty, setNumber, date, time, notes, routine`]
        .concat(
            history
                .map(s => `${s.lift}, ${s.weight}, ${s.reps}, ${s.difficulty}, ${s.setNum}, ${s.date}, ${s.time}, ${"nothing yet"}, ${s.routine}`)
        )
        .join("\n");

    console.log(historyCSV);

    //grab user's dropbox token
    const dbToken = await downloadFile("token");

    //start a new dropbox api connection
    var dbx = new Dropbox({ accessToken: dbToken });

    //send the new lift data up to dropbox.
    dbx.filesUpload({
                contents: historyCSV,
                path: '/liftHistory.csv',
                mode: 'overwrite',
                autorename: true,
                mute: false
            });

    return 'finished uploading';
}

module.exports = sendHistoryToDropbox;

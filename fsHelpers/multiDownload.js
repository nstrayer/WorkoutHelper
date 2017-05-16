'use strict';
// Takes a list of file paths and downloads them and returns their contents in an array.

import downloadFile from './downloadFile';

async function multiDownload(paths){
    let allData = []
    for (let p of paths){
        let data = await downloadFile(p)
        allData.push(data)
    }
    return allData
}

module.exports = multiDownload;

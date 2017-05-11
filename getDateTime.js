'use strict';

// Simply returns an object that has the date in mdy and the time in h-m

const getDateTime = () => {
    const date = new Date();
    return(
        {
            date: `${date.getMonth()}-${date.getDate()}-${date.getFullYear()}`,
            time: `${date.getHours()}:${date.getMinutes()}`
        }
    )
}
module.exports = getDateTime;

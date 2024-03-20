const ical = require('ical');
const fs = require('fs');

// Function to read and parse .ics files
function parseCalendar(filePath) {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, { encoding: 'utf8' }, (err, data) => {
            if (err) {
                console.error("Error reading the file:", filePath, err);
                reject(err);
            } else {
                try {
                    const parsedData = ical.parseICS(data);
                    resolve(parsedData);
                } catch (parseErr) {
                    console.error("Error parsing the calendar data:", parseErr);
                    reject(parseErr);
                }
            }
        });
    });
}

// Function to find free times among multiple sets of events
function findFreeTimes(allEventsArrays) {
    // Flatten the array of arrays of events into a single array of events
    let allEvents = [].concat(...allEventsArrays).sort((a, b) => a.start - b.start);
    let freeTimes = [];

    // Iterate through all events to find gaps between them
    for (let i = 0; i < allEvents.length - 1; i++) {
        if (allEvents[i].end < allEvents[i + 1].start) {
            freeTimes.push({ start: allEvents[i].end, end: allEvents[i + 1].start });
        }
    }

    return freeTimes;
}

module.exports = { parseCalendar, findFreeTimes };

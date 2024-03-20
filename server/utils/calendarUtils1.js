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

// Function to find free times between two sets of events
function findFreeTimes(events1, events2) {
    let allEvents = events1.concat(events2).sort((a, b) => a.start - b.start);
    let freeTimes = [];
    for (let i = 0; i < allEvents.length - 1; i++) {
        if (allEvents[i].end < allEvents[i + 1].start) {
            freeTimes.push({ start: allEvents[i].end, end: allEvents[i + 1].start });
        }
    }
    return freeTimes;
}

module.exports = { parseCalendar, findFreeTimes };

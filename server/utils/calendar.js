const ical = require('ical');
const fs = require('fs');
const moment = require('moment-timezone');

// Function to read and parse .ics files, ensuring timezone is considered
function parseCalendar(filePath) {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, { encoding: 'utf8' }, (err, data) => {
            if (err) {
                reject(err);
            } else {
                try {
                    const parsedData = ical.parseICS(data);
                    resolve(parsedData);
                } catch (parseErr) {
                    reject(parseErr);
                }
            }
        });
    });
}

// Improved findFreeTimes function that respects timezones
function findFreeTimes(events1, events2) {
    // Consider events in their respective timezones
    let allEvents = events1.concat(events2).sort((a, b) => a.start.valueOf() - b.start.valueOf());
    let freeTimes = [];
    for (let i = 0; i < allEvents.length - 1; i++) {
        let end = moment(allEvents[i].end).tz(allEvents[i].end.tz);
        let startNext = moment(allEvents[i + 1].start).tz(allEvents[i + 1].start.tz);
        
        if (end.isBefore(startNext)) {
            freeTimes.push({ start: end.format(), end: startNext.format() });
        }
    }
    return freeTimes;
}

module.exports = { parseCalendar, findFreeTimes };

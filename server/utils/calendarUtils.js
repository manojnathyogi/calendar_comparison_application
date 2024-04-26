const ical = require('ical');
const fs = require('fs');

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

function mergeEvents(calendars) {
    return calendars.flatMap(cal =>
        Object.values(cal).filter(event => event.type === 'VEVENT')
            .map(event => ({
                start: new Date(event.start),
                end: new Date(event.end)
            }))
    ).sort((a, b) => a.start - b.start);
}

function findCommonFreeTimes(events, startBoundary, endBoundary) {
    let freeTimes = [];
    let lastEnd = new Date(events[0].end);

    for (let i = 1; i < events.length; i++) {
        let currentStart = new Date(events[i].start);
        if (currentStart > lastEnd) {
            let freeStart = lastEnd;
            let freeEnd = currentStart;

            // Ensure that the free time is within the daily boundaries
            freeStart = new Date(Math.max(freeStart, startBoundary));
            freeEnd = new Date(Math.min(freeEnd, endBoundary));

            if (freeStart < freeEnd) {
                freeTimes.push({ start: freeStart.toISOString(), end: freeEnd.toISOString() });
            }
        }
        lastEnd = new Date(Math.max(lastEnd, events[i].end));
    }

    // Add time after last event to end of day if applicable
    if (lastEnd < endBoundary) {
        freeTimes.push({ start: lastEnd.toISOString(), end: endBoundary.toISOString() });
    }

    return freeTimes;
}

function findFreeTimes(calendars, startDateTime, endDateTime) {
    const events = mergeEvents(calendars);
    const startBoundary = new Date(startDateTime);
    const endBoundary = new Date(endDateTime);
    return findCommonFreeTimes(events, startBoundary, endBoundary);
}

module.exports = { parseCalendar, findFreeTimes };

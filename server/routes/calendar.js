const express = require('express');
const { parseCalendar, findFreeTimes } = require('../utils/calendarUtils');

const router = express.Router();

module.exports = (upload) => {
    router.post('/compare', upload.array('calendars'), (req, res) => {
        const files = req.files;
        if (!files || files.length < 2) {
            return res.status(400).send('Please upload at least two calendar files.');
        }

        // Process all files
        const parsePromises = files.map(file => parseCalendar(file.path));
        Promise.all(parsePromises)
            .then(calendars => {
                // Extract events from all calendars
                const allEvents = calendars.flatMap(cal => 
                    Object.values(cal)
                    .filter(event => event.type === 'VEVENT')
                    .map(event => ({
                        start: new Date(event.start),
                        end: new Date(event.end)
                    }))
                );

                const freeTimes = findFreeTimes(allEvents);
                res.json({ freeTimes });
            })
            .catch(err => {
                console.error(err);
                res.status(500).send('Error processing calendars.');
            });
    });

    router.post('/feedback', (req, res) => {
        const feedback = req.body.feedback;
        console.log('Feedback received:', feedback);
        res.send('Feedback submitted successfully');
    });

    return router;
};

/*
const express = require('express');
const { parseCalendar, findFreeTimes, generateICSFromFreeTimes } = require('../utils/calendarUtils');

const router = express.Router();

module.exports = (upload) => {
    router.post('/compare', upload.array('calendars'), (req, res) => {
        const files = req.files;
        if (!files || files.length < 2) {
            return res.status(400).send('Please upload at least two calendar files.');
        }

        // Modify this section to handle more than two files if needed
        Promise.all(files.map(file => parseCalendar(file.path)))
            .then(calendars => {
                const events = calendars.flatMap(cal => 
                    Object.values(cal).filter(event => event.type === 'VEVENT').map(event => ({
                        start: new Date(event.start),
                        end: new Date(event.end)
                    }))
                );

                // Assuming all events are combined to find free times
                const freeTimes = findFreeTimes(events, []); // Modify as needed for your logic
                generateICSFromFreeTimes(freeTimes, (err, filePath) => {
                    if (err) {
                        res.status(500).send('Error generating .ics file.');
                    } else {
                        res.download(filePath, 'free-times.ics', (err) => {
                            if (err) {
                                console.error('Error sending the .ics file:', err);
                            }
                            // Optionally delete the file after sending
                            fs.unlink(filePath, (err) => {
                                if (err) console.error('Error deleting the .ics file:', err);
                            });
                        });
                    }
                });
            })
            .catch(err => {
                console.error(err);
                res.status(500).send('Error processing calendars.');
            });
    });

    // Keep the feedback route as is
    router.post('/feedback', (req, res) => {
        // Feedback handling code
    });

    return router;
};
*/
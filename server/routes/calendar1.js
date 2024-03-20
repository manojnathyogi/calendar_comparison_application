const express = require('express');
const { parseCalendar, findFreeTimes } = require('../utils/calendarUtils1');

const router = express.Router();

module.exports = (upload) => {
    router.post('/compare', upload.array('calendars', 2), (req, res) => {
        const files = req.files;
        if (!files || files.length !== 2) {
            return res.status(400).send('Please upload exactly two calendar files.');
        }

        Promise.all([parseCalendar(files[0].path), parseCalendar(files[1].path)])
            .then(([cal1, cal2]) => {
                const events1 = Object.values(cal1).filter(event => event.type === 'VEVENT').map(event => ({
                    start: new Date(event.start),
                    end: new Date(event.end)
                }));

                const events2 = Object.values(cal2).filter(event => event.type === 'VEVENT').map(event => ({
                    start: new Date(event.start),
                    end: new Date(event.end)
                }));

                const freeTimes = findFreeTimes(events1, events2);
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

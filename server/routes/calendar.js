const express = require('express');
const { parseCalendar, findFreeTimes } = require('../utils/calendarUtils');

const router = express.Router();

module.exports = (upload) => {
    router.post('/compare', upload.array('calendars'), async (req, res) => {
        const files = req.files;
        const startDateTime = req.body.startDateTime;  // e.g., "2024-04-15T08:00:00"
        const endDateTime = req.body.endDateTime;      // e.g., "2024-04-19T20:00:00"

        if (!files || files.length < 2) {
            return res.status(400).send('Please upload at least two calendar files.');
        }

        try {
            const calendarData = await Promise.all(files.map(file => parseCalendar(file.path)));
            const freeTimes = findFreeTimes(calendarData, startDateTime, endDateTime);
            res.json({ freeTimes });
        } catch (err) {
            console.error(err);
            res.status(500).send('Error processing calendars.');
        }
    });

    router.post('/feedback', (req, res) => {
        const feedback = req.body.feedback;
        console.log('Feedback received:', feedback);
        res.send('Feedback submitted successfully');
    });

    return router;
};

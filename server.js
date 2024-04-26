const express = require('express');
const multer = require('multer');
const path = require('path');
const calendarRoutes = require('./server/routes/calendar');

const app = express();
const port = 3000;

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/', calendarRoutes(upload));

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(express.json());

const DB_PATH = path.join(__dirname, 'db.json');

let cachedData = null;

const getData = () => {
    if (!cachedData) {
        const rawData = fs.readFileSync(DB_PATH, 'utf8');
        cachedData = JSON.parse(rawData);
    }
    return cachedData;
};

const saveData = (data) => {
    cachedData = data;
    // On Vercel, writing to disk is ephemeral, so we only update memory for production.
    if (process.env.NODE_ENV !== 'production') {
        try {
            fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
        } catch (e) {
            console.warn('Could not write to db.json', e);
        }
    }
};

// API Routes
app.get('/api/activities', (req, res) => {
    res.json(getData().activities);
});

app.post('/api/activities', (req, res) => {
    const data = getData();
    const newActivity = req.body;
    data.activities.push(newActivity);
    saveData(data);
    res.json(newActivity);
});

app.put('/api/activities/:id', (req, res) => {
    const data = getData();
    const idx = data.activities.findIndex(a => String(a.id) === String(req.params.id));
    if (idx !== -1) {
        data.activities[idx] = { ...data.activities[idx], ...req.body };
        saveData(data);
        res.json(data.activities[idx]);
    } else {
        res.status(404).json({ error: 'Activity not found' });
    }
});

app.delete('/api/activities/:id', (req, res) => {
    const data = getData();
    data.activities = data.activities.filter(a => String(a.id) !== String(req.params.id));
    saveData(data);
    res.status(204).end();
});

app.get('/api/users', (req, res) => {
    res.json(getData().users);
});

app.post('/api/users', (req, res) => {
    const data = getData();
    const newUser = req.body;
    data.users.push(newUser);
    saveData(data);
    res.json(newUser);
});

// For Vercel, we export the app
if (process.env.NODE_ENV !== 'production') {
    const PORT = 3000;
    app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
}
module.exports = app;

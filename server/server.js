import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import timezone from 'dayjs/plugin/timezone.js';
const express = require("express");
const cors = require("cors");
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const fs = require('fs');
require('dotenv').config();

dayjs.extend(utc);
dayjs.extend(timezone);

const User = require('./models/User');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const FILE_PATH = './data.json';
const ADMIN_USER = process.env.ADMIN_USER;
const ADMIN_PASS = process.env.ADMIN_PASS;

function readQuotes() {
    return JSON.parse(fs.readFileSync(FILE_PATH, 'utf-8'));
}

function saveQuotes(data) {
    fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2), "utf8");
}

function adminAuth(req, res, next) {
    if (req.headers["admin-pass"] !== ADMIN_PASS)
        return res.status(403).json({ error: "غير مصرح" });
    next();
}

// Connect to MongoDB
const mongoUri = process.env.MONGO_URI;
mongoose.connect(mongoUri)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Register route
app.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) return res.status(400).json({ error: 'username and password required' });

        const existing = await User.findOne({ username });
        if (existing) return res.status(409).json({ error: 'اسم المستخدم موجود بالفعل!' });

        const user = new User({ username, password });
        await user.save();
        return res.status(201).json({ message: 'user registered' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'internal server error' });
    }
});

// Login route
app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) return res.status(400).json({ error: 'username and password required' });

        const user = await User.findOne({ username });
        if (!user) return res.status(401).json({ error: 'اسم المستخدم غير موجود!' });

        const ok = (password === user.password);
        if (!ok) return res.status(401).json({ error: 'كلمة المرور خاطئة!' });

        // For now, return simple success. Replace with JWT/session as needed.
        return res.json({ message: 'login successful', userId: user._id, username: user.username });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'internal server error' });
    }
});

app.get('/daily-quote', (req, res) => {
    const data = readQuotes();
    const now = Date.now() + (3 * 60 * 60 * 1000); // UTC+3
    const today = Math.floor(now / (1000 * 60 * 60 * 24) % data.quotes.length);
    res.json({ quote: data.quotes[today] });
});

app.post('/add-points', async (req, res) => {
    const { username, points, todo } = req.body;

    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: "User not found" });

    const now = dayjs().tz("Asia/Damascus");

    const lastClickForTodo = user.todosClicked.get(todo);
    if (lastClickForTodo) {
        const last = dayjs(lastClickForTodo).tz("Asia/Damascus");

        if (last.isSame(now, 'day')) {
            return res.status(400).json({
                message: `لا يمكنك أن تضغط على زر ${todo} غير مرة في اليوم`
            });
        }
    }

    user.points += points;
    user.todosClicked.set(todo, now.toDate());

    await user.save();

    res.json({ message: `تمت إضافة ${points}$ إلى رصيدك!`, points: user.points });
});
app.post("/quotes-login", (req, res) => {
    const { username, password } = req.body;
    if (username === ADMIN_USER && password === ADMIN_PASS) {
        return res.json({ success: true, message: "تم تسجيل الدخول بنجاح" });
    } else {
        return res.status(401).json({ success: false, message: "بيانات غير صحيحة" });
    }
});

app.get('/quotes', (req, res) => {
    const data = readQuotes();
    res.json({ quotes: data.quotes });
});

app.post("/quotes", adminAuth, (req, res) => {
    const { text } = req.body;

    if (!text) return res.status(400).json({ error: "النص مطلوب" });

    const data = readQuotes();
    data.quotes.push(text);
    saveQuotes(data);

    res.json({ success: true, quotes: data.quotes });
});

app.put("/quotes/:id", adminAuth, (req, res) => {
    const id = Number(req.params.id);
    const { text } = req.body;

    const data = readQuotes();

    if (!data.quotes[id])
        return res.status(404).json({ error: "الجملة غير موجودة" });

    data.quotes[id] = text;
    saveQuotes(data);

    res.json({ success: true, quotes: data.quotes });
});

app.delete("/quotes/:id", adminAuth, (req, res) => {
    const id = Number(req.params.id);

    const data = readQuotes();

    if (!data.quotes[id])
        return res.status(404).json({ error: "الجملة غير موجودة" });

    data.quotes.splice(id, 1);
    saveQuotes(data);

    res.json({ success: true, quotes: data.quotes });
});

app.listen(port, _ => {
    console.log(`Server is running on http://localhost:${port}`)
})
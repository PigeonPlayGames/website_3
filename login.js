require('dotenv').config();

const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('./models/User'); // Adjust the path as necessary to point to your User model

const app = express();
const PORT = 3000;

app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
  .then(() => console.log('MongoDB connected…'))
  .catch(err => console.log(err));

// Register new user
app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        let user = await User.findOne({ username });
        if (user) {
            return res.status(400).send('Username is already taken');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        user = new User({
            username,
            password: hashedPassword
        });

        await user.save();
        res.status(201).send('User registered successfully');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// Login user
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).send('Invalid username or password');
        }

        const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '24h' });
        res.json({ message: "Login successful", token });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// Middleware to authenticate token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// A protected route
app.get('/protected', authenticateToken, (req, res) => {
    res.json({ message: "Access to protected content", user: req.user });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('./models/User'); // Ensure this path matches where you store your User model

const app = express();
const PORT = 3000;
const JWT_SECRET = 'your_jwt_secret_here'; // Move to environment variable in production

app.use(express.json());

// MongoDB connection string
const dbURI = 'your_mongodb_connection_string_here';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
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

        const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '24h' });
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

    if (token == null) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (err, user) => {
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

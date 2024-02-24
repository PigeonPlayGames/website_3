const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Use body-parser middleware to parse JSON bodies
app.use(bodyParser.json());

// Mock user database (replace with real database in production)
let users = [];

// Secret key for JWT (keep secure in production)
const JWT_SECRET = 'your_jwt_secret_here';

// Register new user
app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const userExists = users.some(user => user.username === username);

    if (userExists) {
        return res.status(400).send('Username is already taken');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    users.push({ username, password: hashedPassword });
    res.status(201).send('User registered successfully');
});

// Login user
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = users.find(user => user.username === username);

    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).send('Invalid username or password');
    }

    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ message: "Login successful", token });
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

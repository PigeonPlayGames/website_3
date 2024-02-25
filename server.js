// Import necessary modules
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
require('dotenv').config();

// Create an Express application
const app = express();
const PORT = process.env.PORT || 3000;

// Database connection parameters
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Serve static files from the current directory
app.use(express.static(path.join(__dirname)));

// Serve the main HTML file on the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

// Connect to MongoDB and set up API routes inside the connection callback
client.connect(err => {
    if (err) throw err;
    console.log("Connected successfully to MongoDB");
    
    // Access or create your database and collections
    const database = client.db("pigeonplaygames_db");
    const users = database.collection("users");

    // Define the registration endpoint
    app.post('/register', async (req, res) => {
        const { username, password } = req.body;
        
        // Check if the username already exists
        const existingUser = await users.findOne({ username });
        if (existingUser) {
            return res.status(409).send("Username already exists");
        }

        // Add the new user (consider hashing the password before storing)
        await users.insertOne({ username, password });
        res.status(201).send("User registered successfully");
    });

    // Define the login endpoint
    app.post('/login', async (req, res) => {
        const { username, password } = req.body;
        const user = await users.findOne({ username });

        // Verify the password (hash comparison if hashed)
        if (!user || user.password !== password) {
            return res.status(401).send("Invalid username or password");
        }

        // Login successful - proceed with session or token creation
        res.send("Login successful");
    });

    // Start the server
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});

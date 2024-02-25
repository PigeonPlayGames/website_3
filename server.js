// Import necessary modules
const express = require('express');
const path = require('path');
const bcrypt = require('bcryptjs'); // Add bcryptjs for password hashing
const { MongoClient } = require('mongodb');
require('dotenv').config();

// Create an Express application
const app = express();
const PORT = process.env.PORT || 3000;

// Database connection parameters
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// Middleware to parse JSON bodies
app.use(express.json()); // Use express.json() instead of bodyParser.json() as it's built-in with Express 4.16+

// Serve static files from the current directory
app.use(express.static(path.join(__dirname)));

// Serve the main HTML file on the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

// Connect to MongoDB
async function main() {
    try {
        await client.connect();
        console.log("Connected successfully to MongoDB");
        
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

            // Hash the password before storing
            const hashedPassword = await bcrypt.hash(password, 12);
            await users.insertOne({ username, password: hashedPassword });
            res.status(201).send("User registered successfully");
        });

        // Define the login endpoint
        app.post('/login', async (req, res) => {
            const { username, password } = req.body;
            const user = await users.findOne({ username });

            // Verify the password (hash comparison)
            if (user && await bcrypt.compare(password, user.password)) {
                // Login successful - proceed with session or token creation
                res.send("Login successful");
            } else {
                return res.status(401).send("Invalid username or password");
            }
        });

    } catch (err) {
        console.error(err);
    }
}

main().catch(console.error);

// Start the server outside of the MongoDB connection callback
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

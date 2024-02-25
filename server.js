// Import necessary modules
const express = require('express');
const path = require('path');
const bcrypt = require('bcryptjs'); // Used for password hashing
const mongoose = require('mongoose'); // Mongoose for MongoDB interactions
require('dotenv').config();

// Create an Express application
const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB using Mongoose
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB with Mongoose'))
  .catch(err => console.error('MongoDB connection error:', err));

// Define the User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

// Create a model from the schema
const User = mongoose.model('User', userSchema);

// Middleware to parse JSON bodies
app.use(express.json()); // Built-in middleware for parsing JSON

// Serve static files from the current directory
app.use(express.static(path.join(__dirname)));

// Serve the main HTML file on the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

// Define the registration endpoint
app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    
    try {
        // Check if the username already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(409).send("Username already exists");
        }

        // Hash the password before storing
        const hashedPassword = await bcrypt.hash(password, 12);
        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();

        res.status(201).send("User registered successfully");
    } catch (error) {
        console.error(error);
        res.status(500).send("Error in user registration");
    }
});

// Define the login endpoint
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });

        // Verify the password (hash comparison)
        if (user && await bcrypt.compare(password, user.password)) {
            // Login successful - proceed with session or token creation
            res.send("Login successful");
        } else {
            return res.status(401).send("Invalid username or password");
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Error in user login");
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

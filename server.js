const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const PORT = 3000;

// Replace <username>, <password>, and <cluster-address> with your actual MongoDB credentials
const DB_URI = 'mongodb+srv://<username>:<password>@cluster0.iid9i9h.mongodb.net/myDatabase?retryWrites=true&w=majority';

mongoose.connect(DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB:', err));

app.use(express.json()); // Middleware to parse JSON bodies

// Serve HTML content for the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

// Serve static files
app.use(express.static('public'));

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Require necessary modules
const express = require('express');
const path = require('path');

// Create an Express application
const app = express();

// Define the port to run the server on
const PORT = 3000;

// Serve the login.html file when accessing the root route
app.get('/', (req, res) => {
    // Adjust the path if your login.html is located in a subdirectory within Downloads
    res.sendFile(path.join(__dirname, 'login.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

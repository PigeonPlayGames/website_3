const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// Serve HTML content for the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

// Optional: Serve static files (if you have CSS or JS files in a 'public' directory)
app.use(express.static('public'));

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

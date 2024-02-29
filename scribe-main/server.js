require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 8080;
var cors = require('cors')
const path = require('path');
app.use(cors())
app.use(express.json());

app.use('/scribe', require('./routes'));
app.use(express.static(path.join(__dirname, 'public')));

// Handle requests for the root URL ('/')
app.get('/', (req, res) => {
    // Send the HTML file as a response
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

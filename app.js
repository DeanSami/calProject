const express = require('express');
const path = require('path');
const router = express.Router();

// Init App
let app = express();

// Set Port
app.set('port', (process.env.PORT || 3000));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
})

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, "login.html"));
});

app.listen(app.get('port'), () => {
    console.log('Server started on port ' + app.get('port'));
});
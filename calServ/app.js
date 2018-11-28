const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

let UserRoutes = require('./controllers/users');

let app = express();

app.set('port', process.env.PORT || 3000);

// parse application/json
app.use(bodyParser.json());

app.use(cors());

app.use('/', UserRoutes);

app.listen(app.get('port'), () => {
    console.log('Server is listening on ' + app.get('port'));
});
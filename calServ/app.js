const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const config = require('./config');

const SetupRoutes = require('./controllers/SetupController');
const UserRoutes = require('./controllers/UsersController');

mongoose.connect(config.getDbConString(), { useNewUrlParser: true });

const app = express();
app.set('PORT', process.env.PORT || config.getEnviromentPort());

// parse application/json
app.use(bodyParser.json());

UserRoutes(app);
SetupRoutes(app);

app.listen(app.get('PORT'), () => {
    console.log('Server is listening on ' + app.get('PORT'));
});
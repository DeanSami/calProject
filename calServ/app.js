const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const config = require('./config');
const cors = require('cors');

const SetupRoutes = require('./controllers/SetupController');
const UserRoutes = require('./controllers/UsersController');
const EditorRoutes = require('./controllers/EditorController');
const AdminRoutes = require('./controllers/AdminController');
const PermissionRoutes = require('./controllers/PermissionController');
const CalendarRoutes = require('./controllers/CalendarController');
const GlobalCalendarRoutes = require('./controllers/GlobalCalendarController');

mongoose.connect(config.getDbConString(), { useNewUrlParser: true });

const app = express();

app.set('PORT', process.env.PORT || config.getEnviromentPort());

app.use(bodyParser.json());
app.use(cors());
app.options('*', cors());

UserRoutes(app);
SetupRoutes(app);
EditorRoutes(app);
AdminRoutes(app);
PermissionRoutes(app);
CalendarRoutes(app);
GlobalCalendarRoutes(app);

app.listen(app.get('PORT'), () => {
    console.log('Server is listening on ' + app.get('PORT'));
});

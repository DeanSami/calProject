/** Dependencies
 * @module express - Web framework for Node.js.
 * @module mongoose - MongoDB object modeling for Node.js.
 * @module bodyParser - Node.js body parsing middleware.
 * @module config - This server configurations.
 * @module cors - a Node.js package for providing a Express middleware that can be used to enable CORS with                 various options.
 */
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const config = require('./config');
const cors = require('cors');

/** Permission defined Routes
 * @module SetupRoutes - Only for development stage. fase routes to reset and seed fake data to DB for                              testing.
 * @module UserRoutes - Handles routes available to all users.
 * @module EditorRoutes - Handles routes available only to editors.
 * @module AdminRoutes - Handles routes available only to admins.
 */
const SetupRoutes = require('./controllers/SetupController');
const UserRoutes = require('./controllers/UsersController');
const EditorRoutes = require('./controllers/EditorController');
const AdminRoutes = require('./controllers/AdminController');

/** Connect to DB */
mongoose.connect(config.getDbConString(), { useNewUrlParser: true });

/** */
const app = express();
app.set('PORT', process.env.PORT || config.getEnviromentPort());

// parse application/json
app.use(bodyParser.json());
app.use(cors());

UserRoutes(app);
SetupRoutes(app);
EditorRoutes(app);
AdminRoutes(app);

app.listen(app.get('PORT'), () => {
    console.log('Server is listening on ' + app.get('PORT'));
});
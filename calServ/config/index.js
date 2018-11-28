const configValues = require('./config');
const deployEnviroment = configValues.dev;

module.exports = {
    getDbConString: () => {
        return 'mongodb://' + deployEnviroment.uname + ':' + deployEnviroment.pwd + "@ds117334.mlab.com:17334/calendarproject";
    },
    getEnviromentPort: () => {
        return deployEnviroment.PORT;
    }
}
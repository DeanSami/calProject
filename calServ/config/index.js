const configValues = require('./config');


let env = 'dev';
let deployEnviroment = (env == 'dev')?configValues.dev:configValues.prod;

module.exports = {
    getDbConString: () => {
        return 'mongodb://' + deployEnviroment.uname + ':' + deployEnviroment.pwd + "@ds117334.mlab.com:17334/calendarproject";
    },
    getEnviromentPort: () => {
        return deployEnviroment.PORT;
    }
}
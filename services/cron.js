const cron = require('node-cron');
const {fetchWeatherFromCWB} = require('../controllers/weather');

const cronTask = cron.schedule('0 0 */1 * *', () => {
    console.log('running a task every hour');
    fetchWeatherFromCWB();
});

module.exports = {
    cronTask
}
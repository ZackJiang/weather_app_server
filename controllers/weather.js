const https = require('https');
const Weather = require('../models/weather');

const getWeatherInfo = (req, res) => {
    res.send('Get weather successfully');
}

const fetchWeatherFromCWB = () => {

    https.get(`https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=${process.env.CWB_KEY}&locationName=%E8%87%BA%E5%8C%97%E5%B8%82,%E6%96%B0%E5%8C%97%E5%B8%82,%E6%A1%83%E5%9C%92%E5%B8%82&elementName=MinT,MaxT`, (res) => {
       
        let body = '';

        res.on('data', function(chunk){
            body += chunk;
        });
    
        res.on('end', function(){
            let res = JSON.parse(body);
            let weather = new Weather(res.records);
        
            weather.save( (err) => {
                if (err) {
                    console.log('error')
                }
                console.log('success')
            })

        });
    })
    .on('error', function(e){
          console.log("Got an error: ", e);
    });
}


module.exports = {
    getWeatherInfo,
    fetchWeatherFromCWB,
}
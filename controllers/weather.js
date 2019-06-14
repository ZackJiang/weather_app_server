const https = require('https');

const Weather = require('../models/weather');
const redisClient = require('../services/redis-client');
const redisKey = 'weather';

const getWeatherInfo = (req, res) => {

    try {
        redisClient.get(redisKey, async(err, result) => {

            if (err) res.status(400).json({message:`${err}`});

            if (result) {
                console.log('Data is coming from redis');
                const resultJSON = JSON.parse(result);
                res.status(200).json(resultJSON);
            } else {
                console.log('Data is coming from mongodb');
                let doc = await Weather.find({});
                redisClient.setex(redisKey, 3600, JSON.stringify(doc));
                res.status(200).json(doc);
            }
        });    
    }
    catch(error) {
        res.status(400).json({message:`${error}`});
    }
}

const fetchWeatherFromCWB = () => {

    https.get(`https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=${process.env.CWB_KEY}&locationName=%E8%87%BA%E5%8C%97%E5%B8%82,%E6%96%B0%E5%8C%97%E5%B8%82,%E6%A1%83%E5%9C%92%E5%B8%82&elementName=MinT,MaxT`, (res) => {
       
        let body = '';

        res.on('data', function(chunk){
            body += chunk;
        });
    
        res.on('end', async function() {
            let res = JSON.parse(body);
            await Weather.findOneAndDelete();
            let weather = new Weather(res.records);
            weather.save( (error) => {
                if (error) {
                    console.log(`${error}`)
                }
                console.log('weather information saved')
            })
            redisClient.del(redisKey);
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
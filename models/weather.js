const mongoose = require('mongoose');

var weatherSchema = new mongoose.Schema({
    datasetDescription: String,
    location: [{
        locationName: String,
        weatherElement: [{
            elementName: String,
            time: [{
                startTime: Date,
                endTime: Date,
                parameter: {
                    parameterName: String,
                    parameterUnit: String,
                }
            }],
        }],
    }],
},
{timestamps: true})

module.exports = mongoose.model("Weather", weatherSchema);
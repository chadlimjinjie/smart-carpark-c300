const mongoose = require('mongoose');

const trafficSchema = new mongoose.Schema(
    {
        cars: {type: Number}
    },
    {
        collection: 'traffic',
        versionKey: false
    }
);

module.exports =  mongoose.model('traffic', trafficSchema);
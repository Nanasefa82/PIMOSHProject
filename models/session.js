const { DateTime } = require('luxon');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const sessionSchema = new Schema ({
    date: {type: Date, required: [true, 'Start date  is required']},
    startTime: {type: String, required: [true, 'Time is required']},
    // endTime: {type: String, required: [true, 'Time is required']},
    details: {type: String, required: [true, 'Session details is required']},
    booked : {type: String, required: true, enum: ['Yes', 'No']}
},
{ timestamps: true}
);

module.exports = mongoose.model('Session', sessionSchema);
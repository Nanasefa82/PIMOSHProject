const { DateTime } = require('luxon');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const eventSchema = new Schema ({
    title : {type: String, required: [true, 'Event title is required']},
    startDate: {type: Date, required: [true, 'Start date  is required']},
    endDate: {type: Date, required: [true, 'End date is required']},
    location: {type: String, required: [true, 'Event location is required']},
    details: {type: String, required: [true, 'Event details is required']}, 
    image: {type: String, required: [true, 'Event Flyer is required' ]}
},
{ timestamps: true}
);

module.exports = mongoose.model('Event', eventSchema);
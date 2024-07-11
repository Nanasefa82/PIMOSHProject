const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const rsvpSchema = new Schema({
    fname : {type: String, required: true},
    lname : {type: String, required: true},
    phone : {type: String, required: true},
    email : {type: String, required: true},
    event: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
    forWho: {type: String, required: true, enum: ['My Child', 'Myself', 'Family (dad/Mom + children)', 'PIMOSH Coordinating Supervisor','PIMOSH OSTT Coordinator','PIMOSH Tutor-Mentor','PIMOSH Volunteer','Other']},
    members : {type: String, required: true},
    repSchool: {type: String, required: true, enum: ['Charlotte East Language Academy', 'McClintock Middle School','McKinney-Vento Designee','Oakdale Elementary School','Pitt School Road Elementary School, Concord','Ranson IB Middle School','Ridge Road High School','River Gate Elementary School','Roberta Road Middle School, Concord, NC','Sharon Elementary School','West Charlotte High School','Winget Park STEM Elementary School','Other']},
    amount : {type: String, required: true},
    special : {type: String},
    status : {type: String, required: true, enum: ['Yes', 'No']}



});

module.exports = mongoose.model('RSVP', rsvpSchema);
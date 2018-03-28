const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;

const schema = new Schema({
    cargo_status: {type: String, required: true},
    charterer: {type: String, required: true},
    broker: {type: String, required: true},
    grade: {type: String, required: true},
    quantity: {type: String, required: true},
    date1: {type: Date, required: true},
    date2: {type: Date, required: true},
    load: {type: String, required: true},
    discharge: {type: String, required: true},
    rate_type: {type: String, required: true},
    rate: {type: String, required: true},
    vessel: {type: String, required: true},
    remarks: {type: String, required: true},
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    added_by: {type: String },
	dateadded: { type: Date, default: Date.now }

});
module.exports = mongoose.model('Cargo', schema);

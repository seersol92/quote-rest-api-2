const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create a Schema and a Model

/*
 * @ Child Schema: Load Schema
 *  
*/
const LoadSchema = new Schema({
    supplier: String,
    port: String,
    load_terminal: String,
    cargo_grade: String,
    api: String,
    volume:String,
    date1: String,
    date2: String,
    window_1: String,
    days_before_1: String,
    window_2: String,
    days_before_2:String,
    comments: String,
    volume_tolerance: String,
    loading_tolerance: String
});

/*
 * @ Child Schema: Discharge Schema
 *  
*/
const DischargeSchema = new Schema({
    receiver: String,
    port: String,
    discharge_terminal: String,
    cargo_grade: String,
    api: String,
    volume: String,
    date1: String,
    date2: String,
    window_1: String,
    days_before_1: String,
    window_2: String,
    days_before_2: String,
    comments: String,
    volume_tolerance: String,
    discharge_tolerance: String
});

const quoteStatus = new Schema({
    quoted_by: String,
    status: String,
    is_admin: Boolean   
});

/**
 * @Child Schema Price 
 * 
 */

const PriceSchema = new Schema({
    new_request: Boolean,
    price: String,
    date: {type: Date},
    time: String,
    comments: String,
    quoted_by: String,
    status: String,
    is_admin: Boolean
});

/*
 * @ PArent Schema: Inquiry Quote
 *  
*/

const InquiryQuoteSchema = new Schema({
    segergation: {type: String},
    tank_preparation: {type: String},
    cargo_finance: {type: String},
    cargo_insurance: {type: String},
    estimate_cargo_value: {type: String},
    volume_inspection: {type: String},
    loss_control: {type: String},
    named_vessel: {type: String},
    itinerary_required: {type: String},
    pricing: {type: String},
    units: {type: String},
    required_validity_date: {type: String},
    required_validity_time: {type: String},
    validity_status: { type: Boolean},  
    price: [PriceSchema],
    price_request: {type: Boolean},
    load: [LoadSchema],
    discharge: [DischargeSchema],
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    added_by: {type: String},
    status: {type: String},
    dateadded: { type: Date, default: Date.now },
    added_by_user_id: {type: String}
});


const inquiry = mongoose.model('inquiryquotes', InquiryQuoteSchema);
module.exports = inquiry;
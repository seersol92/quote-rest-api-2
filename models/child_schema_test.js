const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create a Schema and a Model

/*
 * @ Child Schema: Load Schema
 *  
*/
const LoadSchema = new Schema({
    title: String
});

/*
 * @ Child Schema: Discharge Schema
 *  
*/
const DischargeSchema = new Schema({
    title: String
});

/*
 * @ PArent Schema: Inquiry Quote
 *  
*/
const InquiryQuoteSchema = new Schema({
    title: String,
    load: [LoadSchema],
    discharge: [DischargeSchema] 
});


const inquiry = mongoose.model('inquiryquotes', InquiryQuoteSchema);
module.exports = inquiry;
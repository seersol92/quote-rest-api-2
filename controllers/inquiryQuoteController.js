const express = require('express');
const inquiryQuote = require('../models/inquiry_quote'); //import  model schema
const ObjectId = require('mongodb').ObjectID;
const Mail = require('./../config/node-mailer-config');

function upperCaseFirst(str){
    return str.charAt(0).toUpperCase() + str.substring(1);
}

exports.index = function(req, res) {
    res.send('NOT IMPLEMENTED: Site Home Page');
};

// Display list of content list.
exports.quote_list = function(req, res) {
    inquiryQuote.find({} , function(err, cargo_list) {
        if(err){
              res.json({
                   success: false,
                   errors:err
                });
          } else {
             res.json({
                success: true,
                data: cargo_list
            });
          }
       });
};

// Display detail page for a specific Inquiry Quote.
exports.content_detail = function(req, res) {
    res.send('NOT IMPLEMENTED: Book detail: ' + req.params.id);
};

function checkValidity (datetime) {
    datetime = new Date(datetime).getTime();
    const now = new Date().getTime();
    if (isNaN(datetime)) {
        return false;
    }
   const milisec_diff = datetime - now;
    // Zero Time Trigger
    if (milisec_diff <= 0) {
        return false;
    } else {
      return true;
    }
  }

/*
    METHOD: POST
    INFO  : Handle create new Inquiry Quote on POST.
*/
exports.create_post = function(req, res) {
    let loadData = req.body.load;
    let dischargeData = req.body.discharge;
    let price = req.body.quote_price
    const loadList = [];
    const dischargeList =[];
    for (let i = 0; i < loadData.length; i++) {
        loadList.push({
        supplier: loadData[i].supplier,
        port: loadData[i].port,
        load_terminal: loadData[i].load_terminal,
        cargo_grade: loadData[i].cargo_grade,
        api: loadData[i].api,
        volume: loadData[i].volume,
        date1: loadData[i].date1,
        date2: loadData[i].date2,
        window_1: loadData[i].window_1,
        days_before_1: loadData[i].days_before_1,
        window_2: loadData[i].window_2,
        days_before_2: loadData[i].days_before_2,
        comments: loadData[i].comments,
        volume_tolerance: loadData[i].volume_tolerance,
        loading_tolerance: loadData[i].loading_tolerance
        });
      }

    for (let i = 0; i < dischargeData.length; i++) {
        dischargeList.push({
        receiver: dischargeData[i].receiver,
        port: dischargeData[i].port,
        discharge_terminal: dischargeData[i].discharge_terminal,
        cargo_grade: dischargeData[i].cargo_grade,
        api: dischargeData[i].api,
        volume: dischargeData[i].volume,
        date1: dischargeData[i].date1,
        date2: dischargeData[i].date2,
        window_1: dischargeData[i].window_1,
        days_before_1: dischargeData[i].days_before_1,
        window_2: dischargeData[i].window_2,
        days_before_2: dischargeData[i].days_before_2,
        comments: dischargeData[i].comments,
        volume_tolerance: dischargeData[i].volume_tolerance,
        discharge_tolerance: dischargeData[i].discharge_tolerance
        });
    }

    var pat = new inquiryQuote({
        segergation: req.body.shipping.segergation,
        tank_preparation: req.body.shipping.tank_preparation,
        cargo_finance: req.body.shipping.cargo_finance,
        cargo_insurance: req.body.shipping.cargo_insurance,
        estimate_cargo_value: req.body.shipping.estimate_cargo_value,
        volume_inspection: req.body.shipping.volume_inspection,
        loss_control: req.body.shipping.loss_control,
        named_vessel: req.body.quote.named_vessel,
        itinerary_required: req.body.quote.itinerary_required,
        pricing: req.body.quote.pricing,
        units: req.body.quote.units,
        required_validity_date: req.body.quote.required_validity_date,
        required_validity_time: req.body.quote.required_validity_time,
        validity_status: true,
        load: loadData,
        discharge: dischargeList,
        price_request:  req.body.quote.price_request,
        status: 'pending',
        added_by: req.body.added_by,
        added_by_user_id: req.body.quote.user_id
    }); 
    pat.save(function(err, quote){
        if(err) {
            res.json({
               success: false,
               message:'SomeThing Went Wrong!!',
               error: err
            });
        } else {
            let users = [
                {
                    name: req.body.added_by,
                    email: 'hamad.pixiders@gmail.com',
                    subject:'Registered New Quote',
                    data: {
                        app: 'mean stack'
                    }
                }
            ];
            Mail.sendEmail( 'quote', users); // template , userinfo
            res.json({
                success: true,
                message:'Inquiry Quote Has Been Created Successfully!!',
                quote: quote
            });
        }
    });
};

// Handle  delete on POST.
exports.quote_delete_post = function(req, res) {
    inquiryQuote.deleteOne({ _id : req.body.quote_id } , function(err, quote_list) {
        if(err) {
            res.json({
               success: false,
               message:'No, Inquiry Quote Found!!'
            });
        } else {
            res.json({
                success: true,
                message:'Inquiry Quote Deleted Successfully!!'
            });
        }
    });
};

// Handle  price status  on POST. Accept / Reject
exports.quote_update_price_status = function(req, res) {
    update_status(req.body.quote_id, req.body.status);
    inquiryQuote.update(
        { 
          "_id"       : ObjectId(req.body.quote_id) , 
          "price._id" : ObjectId(req.body.price_id)
        },
        { 
        $set : 
        { 
            "price.$.status": req.body.status
        } 
        },
        function(err, numAffected) {
            if(err || numAffected.ok == 0) {
                res.json({
                   success: false,
                   message:'Operation Failed. There is something wrong to ' + req.body.status + ' price.',
                   error: err
                });
            } else {
                res.json({
                    success: true,
                    message: 'Quote price has been ' +req.body.status+ ' successfully!!'
                });
            }
        }
      )
};

// Handle  price  on POST.
function update_validity_detail(quote_id, updated_price) {
inquiryQuote.findByIdAndUpdate(quote_id, { $set: { 
        required_validity_date: updated_price.date,
        required_validity_time: updated_price.time,
        price_request:  false,
        status: 'pending'
    }}, function (err) {
        if(err) {
            res.json({
               success: false,
               message:'No, Inquiry Quote Found!!'
            });
        } else {
           return true
        }
    });
}

// Handle  price  on POST.
function update_status(quote_id, status) {
inquiryQuote.findByIdAndUpdate(quote_id, { $set: { 
        status: status
    }}, function (err) {
        if(err) {
            res.json({
                success: false,
                message:'No, Inquiry Quote Found!!'
            });
        } else {
            return true
        }
    });
}

exports.quote_update_price = function(req, res) {
     
    const updated_price =  req.body.updated_price;
    update_validity_detail(req.body.quote_id, updated_price);
    inquiryQuote.findByIdAndUpdate(req.body.quote_id, { $push: { price: 
        {
            price:  updated_price.price,
            date: updated_price.date,
            time: updated_price.time,
            comments: updated_price.comments,
            quoted_by: updated_price.quoted_by,
            status: updated_price.status

        } }}, function (err) {
        if(err) {
            res.json({
               success: false,
               message:'No, Inquiry Quote Found!!'
            });
        } else {
            res.json({
                success: true,
                message:'Price Updated Successfully!!'
            });
        }
    });
};

exports.update_validity = (req, res) => {
    inquiryQuote.findByIdAndUpdate(req.body.quote_id, { $set: { 
        validity_status: false
    }}, function (err) {
        if(err) {
            res.json({
               success: false,
               message:'No, Inquiry Quote Found!!'
            });
        } else {
            res.json({
                success: true,
                message:'Quote Validity Is Expired.'
            });
        }
    });
}

// Handle Inquiry Qoute details delete on POST.
exports.quote_delete_details_post = function(req, res) {
    const key = req.body.key;
    inquiryQuote.update(
        { "_id": req.body.quote_id },
        { "$pull": { [key] : { "_id": req.body.sub_doc_id } } },
        function(err, numAffected) { 
            if(err || numAffected.ok == 0) {
                res.json({
                   success: false,
                   message:'Operation Failed. There is something wrong with this '+ key+ ' detail.'
                });
            } else {
                res.json({
                    success: true,
                    message: upperCaseFirst(key) + ' has been detail deleted successfully!!'
                });
            }
        }
    );
};

function updateLoad (req, res)
{
    const data = req.body.data;
    inquiryQuote.update(
        { 
          "_id"      : ObjectId(req.body.quote_id) , 
          "load._id" : ObjectId(req.body.sub_doc_id)
        },
        { 
        $set : 
        { 
            "load.$.supplier": req.body.data.supplier,
            "load.$.port": req.body.data.port,
            "load.$.load_terminal": req.body.data.load_terminal,
            "load.$.cargo_grade": req.body.data.cargo_grade,
            "load.$.api": req.body.data.api,
            "load.$.volume": req.body.data.volume,
            "load.$.date1": req.body.data.date1,
            "load.$.date2": req.body.data.date2,
            "load.$.window_1": req.body.data.window_1,
            "load.$.days_before_1": req.body.data.days_before_1,
            "load.$.window_2": req.body.data.window_2,
            "load.$.days_before_2": req.body.data.days_before_2,
            "load.$.comments": req.body.data.comments,
            "load.$.volume_tolerance": req.body.data.volume_tolerance,
            "load.$.loading_tolerance": req.body.data.loading_tolerance
        } 
        },
        function(err, numAffected) {
            if(err || numAffected.ok == 0) {
                res.json({
                   success: false,
                   message:'Operation Failed. There is something wrong with this Load detail.',
                   error: err,
                   q_id: req.body.quote_id,
                   s_doc: req.body.sub_doc_id

                });
            } else {
                res.json({
                    success: true,
                    message: 'Load detail has been updated successfully!!'
                });
            }
        }
      )
}

function updateDischarge (req, res)
{
    inquiryQuote.update(
        { 
          "_id"      : ObjectId(req.body.quote_id) , 
          "discharge._id" : ObjectId(req.body.sub_doc_id)
        },
        { 
        $set : 
        { 
            "discharge.$.receiver": req.body.data.receiver,
            "discharge.$.port": req.body.data.port,
            "discharge.$.discharge_terminal": req.body.data.discharge_terminal,
            "discharge.$.cargo_grade": req.body.data.cargo_grade,
            "discharge.$.api": req.body.data.api,
            "discharge.$.volume": req.body.data.volume,
            "discharge.$.date1": req.body.data.date1,
            "discharge.$.date2": req.body.data.date2,
            "discharge.$.window_1": req.body.data.window_1,
            "discharge.$.days_before_1": req.body.data.days_before_1,
            "discharge.$.window_2": req.body.data.window_2,
            "discharge.$.days_before_2": req.body.data.days_before_2,
            "discharge.$.comments": req.body.data.comments,
            "discharge.$.volume_tolerance": req.body.data.volume_tolerance,
            "discharge.$.discharge_tolerance": req.body.data.discharge_tolerance
        } 
        },
        function(err, numAffected) {
            if(err || numAffected.ok == 0) {
                res.json({
                   success: false,
                   message:'Operation Failed. There is something wrong with this Discharge detail.',
                   error: err,
                   q_id: req.body.quote_id,
                   s_doc: req.body.sub_doc_id

                });
            } else {
                res.json({
                    success: true,
                    message: 'Discharge detail has been updated successfully!!'
                });
            }
        }
      )
}
exports.update_detail = function(req, res) {

    const key = req.body.key;
    if (key == 'load' ) {
        updateLoad(req, res);
    } else if (key == 'discharge') {
        updateDischarge(req, res);        
    }
};
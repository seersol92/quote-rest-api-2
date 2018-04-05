const inquiryQuote = require('../models/inquiry_quote'); //import  model schema

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

/*
    METHOD: POST
    INFO  : Handle create new Inquiry Quote on POST.
*/
exports.create_post = function(req, res) {
    let loadData = req.body.load;
    let dischargeData = req.body.discharge;
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
        required_validity: req.body.quote.required_validity,
        load: loadData,
        discharge: dischargeList, 
        added_by: req.body.added_by
    }); 
    pat.save(function(err, quote){
        if(err) {
            res.json({
               success: false,
               message:'SomeThing Went Wrong!!',
               error: err
            });
        } else {
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


// Handle  delete on POST.
exports.quote_update_price = function(req, res) {
    inquiryQuote.findByIdAndUpdate(req.body.quote, { $set: { pricing: req.body.new_price }}, function (err) {
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

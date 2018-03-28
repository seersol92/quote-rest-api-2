const content = require('../models/inquiry_content'); //import content  model schema

exports.index = function(req, res) {
    res.send('NOT IMPLEMENTED: Site Home Page');
};

// Display list of content list.
exports.content_list = function(req, res) {
    content.find({} , function(err, content_list) {
        if(err){
              res.json({
                   success: false,
                   errors:err
                });
          } else {
             res.json({
                success: true,
                data: content_list
            });
          }
    });
};

// Display detail page for a specific Company.
exports.content_detail = function(req, res) {
    res.send('NOT IMPLEMENTED: Book detail: ' + req.params.id);
};

/*
    METHOD: POST
    INFO  : Handle create new Company on POST.
*/
exports.create_post = function(req, res) {
    req.checkBody('name', 'Name is required').notEmpty();
    req.checkBody('type',  'Type is required').notEmpty();
     var errors = req.validationErrors();
     if (errors) {
        res.json({
            success: false,
            message: errors
        });
     } else {
         
        let create = new content({
               name:    req.body.name,
               type:    req.body.type.toLowerCase()
        });
              // create a comment
            create.save( function(err) {
              if(err && err.errors){
                  res.json({
                       success: true,
                       errors:err.errors
                    });
              } else {
                 res.json({
                    success: true
                });
              }
           });
	 }
};
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const expressValidator = require('express-validator');
const router = express.Router();
const mongoose = require('mongoose');
const config = require('./config/database');
const path = require('path');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const authentication = require('./routes/authentication')(router);
const cargoQuote = require('./routes/cargo_quote');  //Import routes for "cargo_quote" area of site
const cargoRegister = require('./routes/cargo_register');  //Import routes for "cargo_register" area of site
const companyRegister = require('./routes/company_register');  //Import routes for "cargo_register" area of site
const vesselRegister = require('./routes/vessel_register');  //Import routes for "vesselRegister" area of site
const inquiryContent = require('./routes/inquiry_content');  //Import routes for "inquiry_content" area of site
const inquiryQuote = require('./routes/inquiry_quote');  //Import routes for "inquiry_quote" area of site
const user = require('./routes/user');
// ES6 promises
mongoose.Promise = Promise;

// mongodb connection
mongoose.connect(config.uri, {
  useMongoClient: true,
  promiseLibrary: global.Promise
});

var db = mongoose.connection;

// mongodb error
db.on('error', console.error.bind(console, 'connection error:'));

// mongodb connection open
db.once('open', () => {
  console.log(`Connected to Mongo at: ${new Date()}`)
});



// Only for development purpose no need for production version
// not a save  way

app.all('/*', function(req, res, next) {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Methods", "GET, POST","PUT");
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
      next();
});
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(expressValidator());
app.use(express.static(__dirname+'/cleint/dist/'));
app.use('/authentication', authentication);
app.use('/cargo-quote', cargoQuote);
app.use('/cargo-register', cargoRegister);
app.use('/company-register', companyRegister);
app.use('/vessel-register', vesselRegister);
app.use('/content', inquiryContent);
app.use('/inquiry-quote', inquiryQuote);
app.use('/user', user);
app.listen(443, ()=>{
  console.log('listening on the port 443');
});

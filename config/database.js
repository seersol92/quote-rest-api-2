const crypto = require('crypto').randomBytes(256).toString('hex');
config =  {
  uri:'mongodb://mean_dev:hadi9292@ds253918.mlab.com:53918/mean_dev_db',
  secret:crypto,
  db:'mean_dev_db'
}
module.exports = config;

const express = require('express');
const router = express.Router();
//access token middle ware
// Require controller modules.
const inquiry_controller = require('../controllers/inquiryQuoteController');
/// Vessel ROUTES ///

// GET  list of quote.
router.get('/', inquiry_controller.quote_list);

// POST request for creating new inquiry.
router.post('/create', inquiry_controller.create_post);

// POST request for update price.
router.post('/update-price', inquiry_controller.quote_update_price);

// update price details
router.post('/update-detail', inquiry_controller.update_detail);

router.post('/update-validity', inquiry_controller.update_validity);

router.post('/price-status', inquiry_controller.quote_update_price_status);

// POST request to delete  Post.
router.post('/delete', inquiry_controller.quote_delete_post);

// POST request to delete detail load/discharge  Post.
router.post('/delete-detail', inquiry_controller.quote_delete_details_post);

module.exports = router;
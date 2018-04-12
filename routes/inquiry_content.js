const express = require('express');
const router = express.Router();
//access token middle ware
// Require controller modules.
const inquiry_content_controller = require('../controllers/inquiryContentController');
/// Vessel ROUTES ///

// GET catalog home page.
router.get('/', inquiry_content_controller.content_list);

// POST request for creating content.
router.post('/create', inquiry_content_controller.create_post);


router.post('/update-detail', inquiry_content_controller.update_detail);

router.post('/delete-detail', inquiry_content_controller.delete_detail);

module.exports = router;
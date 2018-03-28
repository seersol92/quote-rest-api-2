const express = require('express');
const router = express.Router();
//access token middle ware
// Require controller modules.
const cargo_controller = require('../controllers/cargoQuoteController');
/// CARGO QUOTE ROUTES ///

// GET catalog home page.
router.get('/', cargo_controller.cargo_list);

// POST request for cargo Post
router.post('/create', cargo_controller.cargo_create_post);

router.post('/update', cargo_controller.cargo_update_post);

// POST request to delete cargo Post.
router.post('/delete', cargo_controller.cargo_delete_post);
module.exports = router;
const express = require('express');
const router = express.Router();

const controller = require('../../controller/BlogController');

router.get('/list', controller.getBlogs);

module.exports = router;
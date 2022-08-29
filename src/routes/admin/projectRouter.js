const express = require('express');
const router = express.Router();

const controller = require('../../controller/ProjectController');
const fileUpload = require('../../middleware/FileUpload');

router.post('/insert', fileUpload.uploadSingle(), controller.insertProject);

module.exports = router;
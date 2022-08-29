const express = require('express');
const router = express.Router();

const controller = require('../../controller/TeamController');

router.get('/list', controller.getTeams);

module.exports = router;
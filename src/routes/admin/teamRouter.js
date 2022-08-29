const express = require('express');
const router = express.Router();

const controller = require('../../controller/TeamController');

router.post('/insert', controller.insertTeam);
router.put('/update', controller.updateTeam);
router.put('/delete', controller.deleteTeam);

module.exports = router;
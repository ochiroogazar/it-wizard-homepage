const express = require('express');
const router = express.Router();

const teamRouter = require('../client/teamRouter');
const projectRouter = require('../client/projectRouter');

router.use('/team', teamRouter);
router.use('/project', projectRouter);

module.exports = router;
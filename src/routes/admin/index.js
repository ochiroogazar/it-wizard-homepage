const express = require('express');
const router = express.Router();

const userRouter = require('./userRouter');
const teamRouter = require('./teamRouter');
const projectRouter = require('./projectRouter');

router.use('/', userRouter);
router.use('/team', teamRouter);
router.use('/project', projectRouter);

module.exports = router;
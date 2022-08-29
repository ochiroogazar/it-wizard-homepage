const express = require('express');
const router = express.Router();

const teamRouter = require('../client/teamRouter');
const projectRouter = require('../client/projectRouter');
const blogRouter = require('../client/blogRouter');

router.use('/team', teamRouter);
router.use('/project', projectRouter);
router.use('/blog', blogRouter);

module.exports = router;
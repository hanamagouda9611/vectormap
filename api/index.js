const express = require('express');
const searchRouter = require('./searchApi');
const binduRouter = require('./binduApi');
const maptileApi = require('./maptileApi');
// const mapApi = require('./mapApi');


const router = express.Router();

router.use('/search', searchRouter);
router.use('/bindu', binduRouter);
router.use('/api', maptileApi);
// router.use('/map', mapApi);

module.exports = router;

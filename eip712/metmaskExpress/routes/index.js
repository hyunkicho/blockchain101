var express = require('express');
var router = express.Router();
const ethUtil = require('ethereumjs-util');
const sigUtil = require('@metamask/eth-sig-util');

/* GET home page. */
router.get('/', async function(req, res, next) {
  res.render('index');
});

module.exports = router;

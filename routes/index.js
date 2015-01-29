var express = require('express');
var router = express.Router();

// var countries = ['Worldwide', 'United States', 'Canada', 'Australia', 'United Kingdom', 'Japan'];

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'XTrends' });
});

module.exports = router;

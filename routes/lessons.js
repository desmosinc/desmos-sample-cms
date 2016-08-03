var express = require('express');
var router = express.Router();

/* GET lessons listing. */
router.get('/', function(req, res, next) {
  res.render('lessons/index');
});

// Show the UI for creating a new lesson
router.get('/new', function(req, res, next) {
  res.render('lessons/new');
});

module.exports = router;

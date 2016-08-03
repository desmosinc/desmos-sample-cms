var express = require('express');
var router = express.Router();

/* GET lessons listing. */
router.get('/', function(req, res, next) {
  res.render('lessons/index');
});

module.exports = router;

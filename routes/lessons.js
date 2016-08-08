var express = require('express');
var router = express.Router();
var monk = require('monk');

/* GET lessons listing. */
router.get('/', function(req, res, next) {
  res.render('lessons/index');
});

// Show the UI for creating a new lesson
router.get('/new', function(req, res, next) {
  res.render('lessons/new');
});

// Save a new lesson to the database
router.post('/create', function(req, res, next) {
  var db = req.db;
  var collection = db.get('lessons');
  collection.insert(req.body)
    .then(function(data) {
      res.send(data);
    })
    .catch(function(err) {
      res.send(err);
    })
    .then(function() {
      db.close();
    });
});

module.exports = router;

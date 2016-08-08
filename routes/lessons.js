var express = require('express');
var router = express.Router();
var monk = require('monk');

/* GET lessons listing. */
router.get('/', function(req, res, next) {
  var db = req.db;
  var collection = db.get('lessons');
  collection.find({})
    .then(function(docs) {
      res.render('lessons/index', {lessons: docs});
    })
    .catch(function(err) {
      res.send(err);
    })
    .then(function() {
      db.close();
    });
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

// Edit a particular lesson
router.get('/edit/:id', function(req, res, next) {
  res.render('lessons/edit');
});

// Update an existing lesson
router.post('/update/:id', function(req, res, next) {
  var db = req.db;
  var collection = db.get('lessons');
  var objID = monk.id(req.params.id);
  collection.findOneAndUpdate({_id: objID}, req.body)
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

// Send JSON info for particular lesson
router.get('/api/:id', function(req, res, next) {
  var db = req.db;
  var collection = db.get('lessons');
  var objID = monk.id(req.params.id);
  collection.findOne({_id: objID})
    .then(function(doc) {
      res.send(doc);
    });
});

module.exports = router;

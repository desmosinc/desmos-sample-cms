var express = require('express');
var router = express.Router();
var monk = require('monk');

/* GET lessons listing. */
router.get('/', function(req, res) {
  var db = req.db;
  var collection = db.get('lessons');
  collection.find({})
    .then(function(docs) {
      res.render('lessons/index', {lessons: docs});
    })
    .catch(function(err) {
      res.send(err);
    });
});

// Show the UI for creating a new lesson
router.get('/new', function(req, res) {
  res.render('lessons/new');
});

// Save a new lesson to the database
router.post('/api/create', function(req, res) {
  var db = req.db;
  var collection = db.get('lessons');
  collection.insert(req.body)
    .then(function(data) {
      res.send(data);
    })
    .catch(function(err) {
      res.send(err);
    });
});

// Edit a particular lesson
router.get('/edit/:id', function(req, res) {
  res.render('lessons/edit');
});

// Update an existing lesson
router.post('/api/update/:id', function(req, res) {
  var db = req.db;
  var collection = db.get('lessons');
  var objID = monk.id(req.params.id);
  collection.findOneAndUpdate({_id: objID}, req.body)
    .then(function(data) {
      res.send(data);
    })
    .catch(function(err) {
      res.send(err);
    });
});

// Delete a particular graph
router.get('/api/delete/:id', function(req, res) {
  var db = req.db;
  var collection = db.get('lessons');
  var objID = monk.id(req.params.id);
  collection.findOneAndDelete({_id: objID})
    .then(function(doc) {
      res.redirect('/lessons');
    })
    .catch(function(err) {
      res.send(err);
    });
});

// Send JSON info for particular lesson
router.get('/api/:id', function(req, res) {
  var db = req.db;
  var collection = db.get('lessons');
  var objID = monk.id(req.params.id);
  collection.findOne({_id: objID})
    .then(function(doc) {
      res.send(doc);
    })
    .catch(function(err) {
      res.send(err);
    });
});

// Show a particular lesson
router.get('/:id', function(req, res) {
  var db = req.db;
  var collection = db.get('lessons');
  var objID = monk.id(req.params.id);
  collection.findOne({_id: objID})
    .then(function(doc) {
      res.render('lessons/show', {lesson: doc});
    })
    .catch(function(err) {
      res.send(err);
    });
});

module.exports = router;

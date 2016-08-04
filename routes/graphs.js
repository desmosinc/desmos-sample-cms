var express = require('express');
var router = express.Router();
var monk = require('monk');

// Index of all saved graphs
router.get('/', function(req, res, next) {
  var db = req.db;
  var collection = db.get('graphs');
  collection.find({})
    .then(function(docs) {
      res.render('graphs/index', {graphs: docs});
    })
    .catch(function(err) {
      res.send(err);
    })
    .then(function() {
      db.close();
    });
});

router.get('/list', function(req, res, next) {
  var db = req.db;
  collection = db.get('graphs');
  collection.find({})
    .then(function(docs) {
      res.json(docs);
    });
});

// Show the UI for creating a new graph
router.get('/new', function(req, res, next) {
  res.render('graphs/new');
});

// Save a new graph to the database
router.post('/create', function(req, res, next) {
  var db = req.db;
  var collection = db.get('graphs');
  collection.insert({data: req.body})
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

// Update an existing graph
router.post('/update/:id', function(req, res, next) {
  var db = req.db;
  var collection = db.get('graphs');
  var objID = monk.id(req.params.id);
  collection.findOneAndUpdate({_id: objID}, {data: req.body})
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

// Edit a particular graph
router.get('/edit/:id', function(req, res, next) {
  var db = req.db;
  var collection = db.get('graphs');
  var objID = monk.id(req.params.id);
  collection.findOne({_id: objID})
    .then(function(doc) {
      res.render('graphs/edit', {graph: doc});
    });
});

// Delete a particular graph
router.get('/delete/:id', function(req, res, next) {
  var db = req.db;
  var collection = db.get('graphs');
  var objID = monk.id(req.params.id);
  collection.findOneAndDelete({_id: objID})
    .then(function(doc) {
      res.redirect('/graphs/');
    });
});

// Show a particular graph
router.get('/:id', function(req, res, next) {
  var db = req.db;
  var collection = db.get('graphs');
  var objID = monk.id(req.params.id);
  collection.findOne({_id: objID})
    .then(function(doc) {
      res.render('graphs/show', {graph: doc});
    });
});




module.exports = router;

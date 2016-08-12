var express = require('express');
var router = express.Router();
var monk = require('monk');

// Index of all saved graphs
router.get('/', function(req, res) {
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

// Show the UI for creating a new graph
router.get('/new', function(req, res, next) {
  res.render('graphs/new');
});

// Return a list of graphs via JSON
router.get('/api/list', function(req, res) {
  var db = req.db;
  collection = db.get('graphs');
  collection.find({'public': 'true'})
    .then(function(docs) {
      res.json(docs);
    });
});

// Save a new graph to the database
router.post('/api/create', function(req, res, next) {
  var db = req.db;
  var collection = db.get('graphs');
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

// Send JSON info for particular lesson
router.get('/api/:id', function(req, res) {
  var db = req.db;
  var collection = db.get('graphs');
  var objID = monk.id(req.params.id);
  collection.findOne({_id: objID})
    .then(function(doc) {
      res.send(doc);
    })
    .catch(function(err) {
      res.send(err);
    })
    .then(function() {
      db.close();
    });
});

// Update an existing graph
router.post('/api/update/:id', function(req, res) {
  var db = req.db;
  var collection = db.get('graphs');
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

// Edit a particular graph
router.get('/edit/:id', function(req, res) {
  var db = req.db;
  var collection = db.get('graphs');
  var objID = monk.id(req.params.id);
  collection.findOne({_id: objID})
    .then(function(doc) {
      res.render('graphs/edit', {graph: doc});
    })
    .catch(function(err) {
      res.send(err);
    })
    .then(function() {
      db.close();
    });
});

// Delete a particular graph
router.get('/api/delete/:id', function(req, res) {
  var db = req.db;
  var collection = db.get('graphs');
  var objID = monk.id(req.params.id);
  collection.findOneAndDelete({_id: objID})
    .then(function(doc) {
      res.redirect('/graphs');
    })
    .catch(function(err) {
      res.send(err);
    })
    .then(function() {
      db.close();
    });
});

// Show a particular graph
router.get('/:id', function(req, res) {
  var db = req.db;
  var collection = db.get('graphs');
  var objID = monk.id(req.params.id);
  collection.findOne({_id: objID})
    .then(function(doc) {
      res.render('graphs/show', {graph: doc});
    })
    .catch(function(err) {
      res.send(err);
    })
    .then(function() {
      db.close();
    });
});

module.exports = router;

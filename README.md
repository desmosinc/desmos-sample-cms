Cool Management System (CMS)
============================

This is a sample application to demonstrate using the Desmos API to create a content management system for authoring graphs and embedding them in lesson content.

About
-----
This is a [Node](https://nodejs.org/) application built with the [Express](https://expressjs.com) framework using [Jade](http://jade-lang.com/) templates and backed by a local [MongoDB](https://www.mongodb.com/) database.

Installing
----------
- Make sure you have Node installed, either via [download](https://nodejs.org/en/download/) or [package manager](https://nodejs.org/en/download/package-manager/). On OSX with [Homebrew](http://brew.sh/), you can simply:
```bash
brew update && brew install node
```

- Make sure you have MongoDB installed from the [download page](https://www.mongodb.com/download-center), or via Homebrew:
```bash
brew install mongodb
```

- Set up your `data` directory and get MongoDB running by [following the official instructions](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x/#create-the-data-directory).

- Clone the repository:
```bash
git clone https://github.com/desmosinc/desmos-sample-cms.git
```

- Install the project dependencies:
```bash
cd desmos-sample-cms
npm install
```

- Change `app.js` to point to whatever local db name you want to use. Otherwise it will create/use one called `cms`:
```javascript
// app.js

// Database
var db = monk('localhost:27017/cms'); // change this to whatever local db you want to use
app.use(function(req, res, next) {
  req.db = db;
  next();
});
```

- TODO: Run the script to prepopulate the db with sample data?

Running the App Locally
-----------------------
The app needs a live connection to the database in order to run, so make sure you have a MongoDB process running:
```bash
mongod
```
In another terminal, launch the app server from inside the project root:
```bash
cd desmos-sample-cms
npm start
```
Navigate to [http://localhost:3000/](http://localhost:3000/) and you should be greeted by the home page.

Navigating the App
------------------
The project consists of two resources, `lessons` and `graphs`, that can be created, viewed, edited, and deleted. A `lesson` is made up of questions that can optionally have an associated `graph` embedded. There is only a single user who owns everything (Sue Doe :) ).

### Authoring and Previewing Graphs
To create a new graph, you can begin by clicking the `Graphs` link in the navbar and then the `+` icon in the lower right, or by navigating to `/graphs/new/`. Once you've created a graph, set its title and embedding options by clicking the menu icon in the lower right and checking the appropriate options in the sidebar (a title is requred for saving). Note that only "public" graphs show up as being available to embed in questions in the lesson authoring interface , so check the "Publish" input if you want to experiment with that feature. Finally, click the `save` button.

On a successful save, you will be redirected to the `edit` page for the newly created graph. You can continue to make and save changes that will be persisted to the database. If you go back to the `/graphs` page, you should see a card with your graph's thumbnail and title.

You can inspect the graph as it will appear in its embedded form by clicking the "Preview" link in the graph's card. For instance, if you chose to lock the viewport when you saved the graph, you will not be able to pan or zoom the viewport on the preview page. Click the icon in the lower right to return to the editing view at any time.

### Authoring and Previewing Lessons
Lesson authoring works much the same way as graph authoring. Create a new lesson by clicking the `Lessons` link in the navbar and the `+` icon in the lower right, or by navigating to `/lessons/new`. Enter a title and add a new question with its own title and text content. Once added, you'll see a thumbnail on the left side of the question with another `+` icon. If you click that, you'll see a list of saved graphs that you've marked "public". Clicking on an item of the list attaches a graph to that question, and you should see your graph's thumbnail in the question card.

Once you save a lesson, you're redirected to the edit page (which is basically the same interface). If you go back to the `/lessons` pages, you'll see a card with your new lesson's title, number of questions, and creation date.

If you click the "Preview" link in a lesson card, you'll be directed to a page that shows what the lesson content might look like to an end user. Question titles and text appear on the left, and the associated graphs (if any) appear on the right. You can navigate between questions by clicking the navbar immediately above the content. Click the icon in the lower right to return to the editing view at any time.

Exploring the Code
------------------
Almost everything related to the `graph` resource lives in a subdirectory called `graphs/`, and most code related to the `lesson` resource exists in a `lessons/` subdirectory. In both cases, files (frontend) or routes (backend) correspond to actions available for that resource.

In the case of creating a new graph, for instance, the view lives in `views/graphs/new.jade`, and the frontend code lives in `public/javascripts/graphs/new.js`. On the server side, `routes/graphs.js` contains a `/graphs/new` route for displaying the graph creation page, and a `/graphs/api/create` route for saving a new graph to the database. A good way to get a sense of where the Demsos API is being used is to look in the `graphs` files and directories.

Using the Desmos API
--------------------
Since the purpose of this app is to create a demo authoring environment, it uses only a handful of API methods relevant to creating calculator instances, getting and setting graph states, and taking screenshots to generate thumbnail images. The [official documentation](https://www.desmos.com/api) covers the full set of supported operations, including those for manipulating graphs programmatically.

The following examples demonstrate the main places where the API is used in the application by following the lifecycle of a graph as it is authored, saved, viewed. (The code that creates embedded calculators in lesson content is essentially identical to the code for previewing them in the graph authoring interface.)


### Including the API Script
To include the API in a page, simply use a `<script>` tag whose `src` points to the API JavaScript file. For instance:
```jade
//- views/graphs/new.jade
script(src='//www.desmos.com/api/v0.7/calculator.js?apiKey=dcb31709b452b1cf9dc26972add0fda6')
```

A quick note on API keys. This app uses a demonstration API key that you're welcome to use for development purposes. If you want to use the API in production, you'll need to [contact Desmos and obtain your own key](mailto:info@desmos.com).

### Creating a Calculator Instance
The API exposes a single global variable called `Desmos` with a constructor called `Calculator` whose first argument is the DOM node to contain the calculator, and whose second argument and an optional object with calculator properties. See the documentation for a [complete list of constructor options](https://www.desmos.com/api/v0.7/docs/index.html#document-calculator) and an explanation of what behaviors they control. To instantiate a calculator with default properties, simply pass a `DOMElement` to the constructor:

```javascript
// Bare minimum code needed to instantiate a calculator
var elt = document.getElementById('calculator-container');
var calculator = Desmos.Calculator(elt);
```

One useful option for an authoring system is to allow the creation of "hidden" folders, which (along with their contents) will be invisible in the expressions list of an embedded graph. The `administerSecretFolders` option allows that capability.

```javascript
// public/javascripts/graphs/new.js

var elt = $('#calculator')[0];
var calc = Desmos.Calculator(elt, {
  administerSecretFolders: true
});
```

### Saving a Graph State
You can record the complete state of a calculator at any time by using the `Calculator.getState()` method. In order to save it to the database, the app first serializes the state to JSON:

```javascript
// public/javascripts/graphs/new.js

 // calc is a reference to the calculator instance
function getState() {
  return JSON.stringify(calc.getState());
}
```

The application saves the list of desired embed options via a menu with checkboxes:

![alt text](/public/images/options_menu.png "Options Menu")

```javascript
// public/javascripts/graphs/new.js

// Cache some selectors for getting metadata and graph options
// Each selector points to an <input> in the menu
var $title = $('#title'),
    $public = $('#public'),
    $keypad = $('#keypad'),
    $graphpaper = $('#graphpaper'),
    $expressions = $('#expressions'),
    $settingsMenu = $('#settingsMenu'),
    $zoomButtons = $('#zoomButtons'),
    $expressionsTopbar = $('#expressionsTopbar'),
    $pointsOfInterest = $('#pointsOfInterest'),
    $singleVariableSolutions = $('#singleVariableSolutions'),
    $border = $('#border'),
    $lockViewport = $('#lockViewport'),
    $expressionsCollapsed = $('#expressionsCollapsed');

function getOptions() {
  return JSON.stringify({
    keypad: $keypad.prop('checked'),
    graphpaper: $graphpaper.prop('checked'),
    expressions: $expressions.prop('checked'),
    settingsMenu: $settingsMenu.prop('checked'),
    zoomButtons: $zoomButtons.prop('checked'),
    expressionsTopbar: $expressionsTopbar.prop('checked'),
    pointsOfInterest: $pointsOfInterest.prop('checked'),
    singleVariableSolutions: $singleVariableSolutions.prop('checked'),
    border: $border.prop('checked'),
    lockViewport: $lockViewport.prop('checked'),
    expressionsCollapsed: $expressionsCollapsed.prop('checked')
  });
}
```

Tha app also [takes a screenshot](https://www.desmos.com/api/v0.7/docs/index.html#document-saving-and-loading) of the graph to use as a thumbnail in various views. `Calculator.screenshot()` returns a png [data uri](https://en.wikipedia.org/wiki/Data_URI_scheme), which &mdash; for simplicity &mdash; is how the app stores it in the database. To save a screenshot as an image file instead, you can [parse the data and base64 decode it](http://stackoverflow.com/questions/11335460/how-do-i-parse-a-data-url-in-node/11335500#11335500).
```javascript
// public/javascripts/graphs/new.js

var state = getState();
var options = getOptions();
var thumb = calc.screenshot({
  width: 500,
  height: 300,
  targetPixelRatio: 1
});
```

To persist the graph to the database with the metadata such as title, options, and thumbnail uri, an AJAX call is made to the server:

```javascript
// public/javascripts/graphs/new.js

$.post('/graphs/api/create', {
  state: state,
  options: options,
  title: $title.val(),
  public: $public.prop('checked'),
  thumbnail: thumb
});
```

On the backend, the `graphs/api/create` route handles the saving:

```javascript
// routes/graphs.js

// Save a new graph to the database
router.post('/api/create', function(req, res) {
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
```

### Setting a Graph State
Once a graph has been saved, it's possible to preview it with the same embed options that were saved at creation time. Navigating to `graphs/:id` shows the graph in its final form.

Here are the total contents of `public/javascripts/graphs/show.js`, used to preview the graph. `Calculator.setState()` sets the calculator to the state that was captured previously by the `Calculator.getState()` call.

```javascript
// public/javascripts/graphs/show.js

$(function() {
  
  function getGraphID() {
    var fullPath = location.pathname;
    id = fullPath.substr(fullPath.lastIndexOf('/') + 1);
    return id;
  }
  var id = getGraphID();
  
  var elt = $('#calculator')[0];

  // Fetch the graph data from the db
  $.get('/graphs/api/' + id)
    .done(function(data) {
      var options = JSON.parse(data.options); // the saved options from the author
      var calc = Desmos.Calculator(elt, options); // instantiate a calculator with those options
      $('.progress').remove();
      
      calc.setState(data.state); // set the state of the current calculator to the saved state
      $('.btn-floating').attr('href', '/graphs/edit/' + id); // Hook up the edit button to the correct route
    });
  
});
```

A quick note on getting and setting states. Even though `Calculator.getState()` returns a regular JavaScript object, the object itself should be considered opaque. I.e., it shouldn't be manipulated or parsed other than to (de)serialize it for database operations or passing around to other calculator instances. The details of what's returned aren't guaranteed to be stable over time. The only guarantee is that the return value of `Calculator.getState()` will always be a suitable input for `Calculator.setState()`.

Final Notes
-----------

To learn about everything that's possible through the API, refer to the [official documentation](https://www.desmos.com/api). Stable versions are released on a six-month cycle. To inquire about using the API in production, [contact Desmos](mailto:info@desmos.com).

For more information on using the Desmos calculator in general, see the [Learn Desmos](http://learn.desmos.com) site.

Author: Chris Lusto, 2016

License: MIT

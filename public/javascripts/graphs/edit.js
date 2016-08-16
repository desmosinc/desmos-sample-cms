$(function() {

  function getGraphID() {
    var fullPath = location.pathname;
    id = fullPath.substr(fullPath.lastIndexOf('/') + 1);
    return id;
  }
  var id = getGraphID();

  // Cache some selectors for getting metadata and graph options
  var $title = $('#title'),
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

  // Instantiate a new calculator
  var elt = $('#calculator')[0];
  var calc = Desmos.Calculator(elt, {
    administerSecretFolders: true
  });

  // Fetch the graph data from the db
  $.get('/graphs/api/' + id)
    .done(function(data) {
      calc.setState(data.state);
      $('.progress').remove();

      // Graph options to populate the checkboxes correctly
      var options = JSON.parse(data.options);
      for (var prop in options) {
        if (options.hasOwnProperty(prop)) {
          $('#' + prop).prop('checked', options[prop]);
        }
      }

      $title.val(data.title);
    });

  // Get a snapshot of the calculator state
  function getState() {
    return JSON.stringify(calc.getState());
  }

  // Get the options for embedding
  // These will be passed into the constructor for the embedded calculator
  // that will display this graph state
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

  function saveGraph() {
    if ($title.val() === '') {
      Materialize.toast('You need a title!', 2000);
      return;
    }

    var state = getState(); // the calculator state
    var options = getOptions(); // the constructor options
    var thumb = calc.screenshot({ // the thumbnail uri
      width: 500,
      height: 300,
      targetPixelRatio: 1
    });

    $.post('/graphs/api/update/' + graphData._id, {
      state: state,
      options: options,
      title: $title.val(),
      thumbnail: thumb
    })
      .done(function() {
        Materialize.toast('Saved!', 2000);
      })
      .fail(function() {
        toast('Error saving...');
      });
  };

  // Event handlers
  var $settingsButton = $('#settings-button');
  $settingsButton.sideNav({
    menuWidth: 500,
    edge: 'right'
  });

  $('#save-button').click(function(evt) {
    $settingsButton.sideNav('hide');
    saveGraph();
    evt.preventDefault();
  });

});
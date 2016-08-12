$(function() {
  
  // Instantiate a new calculator with default options
  var elt = $('#calculator')[0];
  var calc = Desmos.Calculator(elt, {
    administerSecretFolders: true
  });
  $('.progress').remove();
  
  // Cache some selectors for getting metadata and graph options
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
    var thumb = calc.screenshot({ // the thumbnail data uri
      width: 500,
      height: 300,
      targetPixelRatio: 1
    });
    
    $.post('/graphs/api/create', {
      state: state,
      options: options,
      title: $title.val(),
      public: $public.prop('checked'),
      thumbnail: thumb
    })
      .done(function(data) {
        window.location.replace('/graphs/edit/' + data._id);
      })
      .fail(function() {
        Materialize.toast('Error saving...', 2000);
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
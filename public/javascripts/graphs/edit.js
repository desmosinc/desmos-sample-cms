$(function() {
  
  // Instantiate a new calculator with the correct options
  var elt = $('#calculator')[0];
  var calc = Desmos.Calculator(elt, {
    administerSecretFolders: true
  });
  calc.setState(graphData.state);
  $('.progress').remove();
  
  // Graph options to populate the checkboxes correctly
  var options = JSON.parse(graphData.options);
  
  for (var prop in options) {
    if (options.hasOwnProperty(prop)) {
      $('#' + prop).prop('checked', options[prop]);
    }
  }
  
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
      
  $title.val(graphData.title);
  $public.prop('checked', graphData.public === 'true');
      
  function getState() {
    return JSON.stringify(calc.getState());
  }
  
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
    
    var state = getState();
    var options = getOptions();
    var thumb = calc.screenshot({
      width: 500,
      height: 300,
      targetPixelRatio: 1
    });
    
    $.post('/graphs/update/' + graphData._id, {
      state: state,
      options: options,
      title: $title.val(),
      public: $public.prop('checked'),
      thumbnail: thumb
    })
      .done(function() {
        toast('Saved!');
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
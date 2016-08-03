$(function() {
  
  // Instantiate a new calculator with the correct options
  var elt = $('#calculator')[0];
  var calc = Desmos.Calculator(elt, {
    administerSecretFolders: true
  });
  calc.setState(graphData.data.state);
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
      
  $title.val(graphData.data.title);
      
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
      toast('You need a title!');
      return;
    }
    
    var state = getState();
    var options = getOptions();
    
    $.ajax({
      url: '/graphs/udpate/' + graphData.data._id,
      method: 'PUT',
      state: state,
      options: options,
      title: $title.val(),
      public: $public.prop('checkbox')
    })
      .done(function() {
        toast('Saved!');
      })
      .fail(function() {
        toast('Error saving...');
      });
  };
  
  function toast(msg) {
    Materialize.toast(msg, 2000);
  }
  
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
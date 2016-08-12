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
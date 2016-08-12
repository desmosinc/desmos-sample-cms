$(function() {
  
  var elt = $('#calculator')[0];
  var options = JSON.parse(graphData.options); // the saved options from the author
  var calc = Desmos.Calculator(elt, options); // instantiate a calculator with those options
  $('.progress').remove();
  
  calc.setState(graphData.state); // set the state of the current calculator to the saved state
  
});
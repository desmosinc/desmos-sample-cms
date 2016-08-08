$(function() {
  
  var elt = $('#calculator')[0];
  var options = JSON.parse(graphData.options);
  var calc = Desmos.Calculator(elt, options);
  $('.progress').remove();
  
  calc.setState(graphData.state);
  
});
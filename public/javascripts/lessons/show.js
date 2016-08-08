$(function() {
  
  function getLessonID() {
    var fullPath = location.pathname;
    id = fullPath.substr(fullPath.lastIndexOf('/') + 1);
    return id;
  }
  
  var id = getLessonID();
  
  var $tabs = $('.tabs'),
      $questionContainer = $('.question-container');
  
  function insertQuestion(num, title, text) {
    $tabs.append('<li class="tab col s3"><a href="#q' +num+ '">Q' +num+ '</a></li>');
    $questionContainer.append('<div id="q' +num+ '"><h1>' +title+ '</h1></div>');
  }
  
  insertQuestion(1, 'First Question');
  insertQuestion(2, 'Second Question');
  insertQuestion(3, 'Third Question');
  insertQuestion(4, 'Fourth Question');
  insertQuestion(5, 'Fifth Question');

  
  // Initialize tabs
  $tabs.tabs();
  
});
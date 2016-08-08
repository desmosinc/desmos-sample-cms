$(function() {
  
  function getLessonID() {
    var fullPath = location.pathname;
    id = fullPath.substr(fullPath.lastIndexOf('/') + 1);
    return id;
  }
  
  var id = getLessonID();
  var questions = []
  
  var $tabs = $('.tabs'),
      $questionContainer = $('.question-container');
  
  function insertQuestion(num, title, text) {
    $tabs.append('<li class="tab col s3"><a href="#q' +num+ '">Q' +num+ '</a></li>');
    var $div = $('<div id="q' +num+ '" class="white container"><h4 class="center">' +title+ '</h4></div>');
    $div.append($('<div class="question-text container left"><p>' +text+ '</p></div>'));
    $div.append($('<div class="calculator right" id="calculator' +num+ '"></div>'));
    $questionContainer.append($div);
  }
    
  function loadLesson() {
    $.get('/lessons/api/' + id)
      .done(function(data) {
        var questionObj = JSON.parse(data.questions);
        // $lessonTitle.val(data.title);
        for (var q in questionObj) {
          var question = questionObj[q];
          questions[question.number - 1] = question;
        }
        questions.forEach(function(elt, ind, arr) {
          insertQuestion(elt.number, elt.title, elt.text);
          if (elt.graphID !== '') {
            $.get('/graphs/api/' + elt.graphID)
              .done(function(data) {
                var calcElt = $('#calculator' + elt.number)[0];
                var calcOpts = JSON.parse(data.options);
                var calc = Desmos.Calculator(calcElt, calcOpts);
                calc.setState(data.state);
              });
          }
        });
        // Initialize tabs
        $tabs.tabs();
        $('.progress').remove();
      });
  }
  loadLesson();
      
});
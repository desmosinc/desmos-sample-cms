$(function() {
  
  function getLessonID() {
    var fullPath = location.pathname;
    id = fullPath.substr(fullPath.lastIndexOf('/') + 1);
    return id;
  }
  
  var id = getLessonID();
  var questions = [];
  var calcs = [];
  
  var $tabs = $('.tabs'),
      $questionContainer = $('.question-container');
  
  function insertQuestion(num, title, text) {
    $tabs.append('<li class="tab col s3"><a href="#q' +num+ '">Q' +num+ '</a></li>');
    var $div = $('<div id="q' +num+ '" class="white container row"><h4 class="center q-title">' +title+ '</h4></div>');
    var $leftDiv = $('<div class="question-text container col s6"><p>' +text+ '</p></div>');
    $div.append($leftDiv);
    $div.append($('<div class="calculator col s6" id="calculator' +num+ '"></div>'));
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
                calcs.push(calc);
              });
          }
        });
        // Initialize tabs
        $tabs.tabs({onShow: function() {
          calcs.forEach(function(elt) {
            elt.resize();
          });
        }});
        $('.progress').remove();
      });
  }
  loadLesson();
  

      
});
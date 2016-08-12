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
        for (var q in questionObj) {
          var question = questionObj[q];
          questions[question.number - 1] = question;
        }
        questions.forEach(function(elt, ind, arr) {
          insertQuestion(elt.number, elt.title, elt.text);
          // If a question has an associated graph...
          if (elt.graphID !== '') {
            $.get('/graphs/api/' + elt.graphID) // fetch the graph from the db
              .done(function(data) {
                var calcElt = $('#calculator' + elt.number)[0]; // reference to the containing element
                var calcOpts = JSON.parse(data.options); // parse the constructor options
                var calc = Desmos.Calculator(calcElt, calcOpts); // instantiate a calculator w/ options
                calc.setState(data.state); // set the calculator state
                calcs.push(calc); // keep a list of all the calculators on the page
              });
          }
        });
        // Initialize tabs
        $tabs.tabs({onShow: function() {
          calcs.forEach(function(elt) {
            // TODO: Gross
            elt.resize();
          });
        }});
        $('.progress').remove();
      });
  }
  loadLesson();
  

      
});
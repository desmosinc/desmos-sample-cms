$(function() {
  
  // Cache some selectors
  var $lessonTitle = $('#title'),
      $questionTitle = $('#question-title'),
      $questionText = $('#question-text'),
      $questionRow = $('.questions');
      
  function insertQuestion() {
    
    var questionNum = $questionRow.children().length;
    
    var template = $('.question-template').html()
    var $newQuestion = $(template);
    $newQuestion.find('.card-title').text(questionNum +') '+ $questionTitle.val());
    $newQuestion.find('p').text($questionText.val());
    $newQuestion.removeClass('question-template');
    
    $questionRow.append($newQuestion);
    
    $questionTitle.val('');
    $questionText.val('');
  }
  
  // Handlers
  $('#add-question').click(function(evt) {
    insertQuestion();
    evt.preventDefault();
  });
  
});
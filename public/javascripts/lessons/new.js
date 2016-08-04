$(function() {
  
  // Cache some selectors
  var $lessonTitle = $('#title'),
      $questionTitle = $('#question-title'),
      $questionText = $('#question-text'),
      $questionRow = $('.questions'),
      $questionModal = $('#question-modal'),
      $insertUpdateQuestion = $('#insert-update-question');
      
  var template = $('.question-template').html();
  
  var editing = false;
  var currentQuestion = 0;
  var questions = [];
  
  // Question
  function Question(opts) {
    this.title = opts.title;
    this.text = opts.text;
    this.number = questions.length + 1;
    this.insert();
  }
  
  Question.prototype.insert = function() {
    var self = this;
    
    var $newQuestion = $('<div class="row question">' + template + '</div>');
    $newQuestion.find('h4').text($questionTitle.val());
    $newQuestion.find('p').text($questionText.val());
    $newQuestion.removeClass('question-template');
    $newQuestion.attr('data-number', this.number);
    
    $questionRow.append($newQuestion);
    
    $questionTitle.val('');
    $questionText.val('');
    
    // Attach handlers to the new buttons only
    $newQuestion.find('.remove-question').click(function(evt) {
      $(this).closest('.row').remove();
      self.remove();
      evt.preventDefault();
    });
    
    $newQuestion.find('.edit-question').click(function(evt) {
      editing = true;
      currentQuestion = self.number;
      var $this = $(this);
      var title = $this.closest('.row').find('h4').text();
      var text = $this.closest('.row').find('p').text();
      $questionTitle.val(title);
      $questionText.val(text);
      $insertUpdateQuestion.text('Update');
      $questionModal.openModal();
      evt.preventDefault();
    });
  };
  
  Question.prototype.remove = function() {
    questions.splice(this.number - 1, 1);
    questions.forEach(function(elt, ind, arr) {
      elt.setNumber(ind + 1);
    });
  };
  
  Question.prototype.setNumber = function(newNum) {
    this.number = newNum;
  };
  
  Question.prototype.setContents = function(newTitle, newText) {
    this.title = newTitle;
    this.text = newText;
    var $question = $('.question').eq(this.number - 1);
    $question.find('h4').text(newTitle);
    $question.find('p').text(newText);
  };
  
  // Handlers
  $('#add-question').click(function(evt) {
    $insertUpdateQuestion.text('Add');
    $questionModal.openModal();
    evt.preventDefault();
  });
  
  $insertUpdateQuestion.click(function(evt) {
    if (editing) {
      questions[currentQuestion - 1].setContents($questionTitle.val(), $questionText.val());
      editing = false
      currentQuestion = 0;
    } else {
      questions.push(new Question({
        title: $questionTitle.val(),
        text: $questionText.val()
      }));
    }
    evt.preventDefault();
  });
  
});
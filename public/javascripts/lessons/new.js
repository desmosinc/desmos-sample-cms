$(function() {
  
  // Cache some selectors
  var $lessonTitle = $('#title'),
      $questionTitle = $('#question-title'),
      $questionText = $('#question-text'),
      $questionRow = $('.questions'),
      $questionModal = $('#question-modal');
      
  var template = $('.question-template').html();
  
  questions = [];
  
  function Question(opts) {
    this.title = opts.title;
    this.text = opts.text;
    this.number = questions.length + 1;
    this.insert();
  }
  
  Question.prototype.insert = function() {
    var self = this;
    
    var $newQuestion = $('<div class="row question">' + template + '</div>');
    $newQuestion.find('.card-title').text($questionTitle.val());
    $newQuestion.find('p').text($questionText.val());
    $newQuestion.removeClass('question-template');
    $newQuestion.attr('data-number', this.number);
    
    $questionRow.append($newQuestion);
    
    $questionTitle.val('');
    $questionText.val('');
    
    $newQuestion.find('.remove-question').click(function() {
      $(this).closest('.row').remove();
      self.remove();
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

  
  // Handlers
  $('#add-question').click(function(evt) {
    $questionModal.openModal();
    evt.preventDefault();
  });
  
  $('#insert-question').click(function(evt) {
    questions.push(new Question({
      title: $questionTitle.val(),
      text: $questionText.val()
    }));
    evt.preventDefault();
  });
  
});
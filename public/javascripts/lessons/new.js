$(function() {
  
  // Cache some selectors
  var $lessonTitle = $('#title'),
      $questionTitle = $('#question-title'),
      $questionText = $('#question-text'),
      $questionRow = $('.questions'),
      $questionModal = $('#question-modal'),
      $graphsModal = $('#graphs-modal'),
      $graphsCollection = $('#graphs-collection'),
      $insertUpdateQuestion = $('#insert-update-question');
      
  var template = $('.question-template').html();
  
  var editing = false;
  var currentQuestion = 0;
  var questions = [];
  
  function resetForm() {
    editing = false;
    currentQuestion = 0;
    $questionTitle.val('');
    $questionText.val('');
  }
  
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
    $questionRow.append($newQuestion).hide().fadeIn('fast');
    
    // Attach handlers to the new buttons only
    $newQuestion.find('.remove-question').click(function(evt) {
      $(this).closest('.row').animate({opacity: 0, height: 0},'fast', function() {
        this.remove();
      });
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
    
    $newQuestion.find('.insert-image').click(function() {
      currentQuestion = self.number;
      $graphsModal.openModal();
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
    resetForm();
  };
  
  // Populate the graphs modal
  $.get('/graphs/list')
    .done(function(data) {
      populateGraphs(data);
    });
    
  function populateGraphs(data) {
    data.forEach(function(elt, ind, arr) {
      var $item = $('<li class="collection-item avatar graph-item valign-wrapper"></li>');
      $item.append($('<span class="title valign">' + elt.data.title + '</span>'));
      $item.append($('<img src=' + elt.data.thumbnail + '>'));
      $item.click(function() {
        $('.graph-preview').eq(currentQuestion).attr('src', elt.data.thumbnail);
        $graphsModal.closeModal();
      });
      $graphsCollection.append($item);
    });
  }
  
  // Handlers
  $('#add-question').click(function(evt) {
    $insertUpdateQuestion.text('Add');
    $questionModal.openModal();
    evt.preventDefault();
  });
  
  $('#cancel').click(function(evt) {
    resetForm();
    evt.preventDefault();
  });
  
  $insertUpdateQuestion.click(function(evt) {
    if (editing) {
      questions[currentQuestion - 1].setContents($questionTitle.val(), $questionText.val());
      resetForm();
    } else {
      questions.push(new Question({
        title: $questionTitle.val(),
        text: $questionText.val()
      }));
    }
    evt.preventDefault();
  });
  
  $('#cancel-graph').click(function(evt) {
    evt.preventDefault();
  });
  
});
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
  questions = [];
  
  function resetForm() {
    editing = false;
    currentQuestion = 0;
    $questionTitle.val('');
    $questionText.val('');
  }
  
  function getLessonID() {
    var fullPath = location.pathname;
    id = fullPath.substr(fullPath.lastIndexOf('/') + 1);
    return id;
  }
  
  var id = getLessonID();
  
  
  // Question
  Question = function(opts) {
    this.title = opts.title;
    this.text = opts.text;
    this.number = opts.number !== undefined ? opts.number : questions.length + 1;
    this.graphID = opts.graphID !== undefined ? opts.graphID : '';
    this.thumbnail = opts.thumbnail !== undefined ? opts.thumbnail : '';
    this.insert();
  }
  
  Question.prototype.insert = function() {
    var self = this;
    
    var $newQuestion = $('<div class="row question">' + template + '</div>');
    $newQuestion.find('h4').text(this.title);
    $newQuestion.find('p').text(this.text);
    if (this.thumbnail !== '') {
      $newQuestion.find('img').attr('src', this.thumbnail);
    }
    $newQuestion.removeClass('question-template');
    $newQuestion.attr('data-number', this.number);
    $questionRow.append($newQuestion);
    $newQuestion.hide().fadeIn('fast');
    
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
    
    var $removeImage = $newQuestion.find('.remove-image');
    $removeImage.click(function() {
      $('.graph-preview').eq(self.number).attr('src', '/images/graph_bg.png');
      questions[self.number - 1].graphID = '';
      questions[self.number - 1].thumbnail = '';
      $(this).hide();
    });
    if (this.thumbnail === '') $removeImage.hide();

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
  $.get('/graphs/api/list')
    .done(function(data) {
      populateGraphs(data);
    });
    
  function populateGraphs(data) {
    data.forEach(function(elt, ind, arr) {
      var $item = $('<li class="collection-item avatar graph-item valign-wrapper"></li>');
      $item.append($('<span class="title valign">' + elt.title + '</span>'));
      $item.append($('<img src=' + elt.thumbnail + '>'));
      $item.click(function() {
        $('.graph-preview').eq(currentQuestion).attr('src', elt.thumbnail);
        $('.remove-image').eq(currentQuestion).show();
        questions[currentQuestion - 1].graphID = elt._id;
        questions[currentQuestion - 1].thumbnail = elt.thumbnail;
        currentQuestion = 0;
        $graphsModal.closeModal();
      });
      $graphsCollection.append($item);
    });
  }
  
  function serializeQuestions() {
    var obj = {};
    questions.forEach(function(elt, ind, arr) {
      obj[elt.number] = elt;
    });
    return JSON.stringify(obj);
  }
    
  function saveLesson() {
    var title = $lessonTitle.val();
    if (title === '') {
      Materialize.toast('You need a title!', 2000);
      return;
    }
    if (!questions.length) {
      Materialize.toast('You need some questions!', 2000);
      return;
    }
    var questionObject = serializeQuestions();
    $.post('/lessons/api/update/' + id, {
      title: title,
      numQuestions: questions.length,
      questions: questionObject,
      created: new Date().toDateString()
    })
      .done(function(data) {
        Materialize.toast('Saved!', 2000);
      })
      .fail(function() {
        Materialize.toast('Error saving...', 2000);
      });
  }
  
  function loadLesson() {
    $.get('/lessons/api/' + id)
      .done(function(data) {
        var questionObj = JSON.parse(data.questions);
        $lessonTitle.val(data.title);
        for (var q in questionObj) {
          var question = questionObj[q];
          questions[question.number - 1] = new Question({
            title: question.title,
            text: question.text,
            graphID: question.graphID,
            thumbnail: question.thumbnail
          });
        }
      });
  }
  loadLesson();
    
  // Handlers
  $('#add-question').click(function(evt) {
    resetForm();
    $insertUpdateQuestion.text('add');
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
  
  $('#save-lesson').click(saveLesson);
  
});
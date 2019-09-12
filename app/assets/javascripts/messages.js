$(function() {
   function buildHTML(message) {
    var content = message.content ? `<p class="lower-message__content">${message.content}</p>` : "";
    var img = message.image.url ? `<img class="lower-message__image" src= ${message.image.url}>` : "";
    var html = `<div class="message" data-message-id="${message.id}">
                  <div class="upper-message">
                    <div class="upper-message__user-name">
                      ${ message.user_name}
                    </div>
                    <div class="upper-message__date">
                      ${message.created_at}
                    </div>
                  </div>
                  <div class="lower-message">
                    ${content}
                    ${img}
                  </div>
                </div>`
      return html;
  }

  function scrollBottom(){
    var target = $('.message').last();
    var position = target.offset().top + $('.messages').scrollTop();
    $('.messages').animate({
      scrollTop: position
    }, 300, 'swing');
  }

  $('#new_message').on('submit', function(e) {
    e.preventDefault();
    var formData = new FormData(this);
    var url = $(this).attr('action');
    $.ajax({
      url: url,
      type: 'POST',
      data: formData,
      dataType: 'json',
      processData: false,
      contentType: false
    })
    .done(function(data){
      $('#new_message')[0].reset(); 
      var html = buildHTML(data);
      $('.messages').append(html);
      $('.messages').animate({ scrollTop: $('.messages')[0].scrollHeight }, 'fast');
      $('.form__submit').removeAttr("disabled");
      $('.notification').empty();

    })
    .fail(function () {
      alert('エラーが発生したためメッセージは送信できませんでした。');
      $('.form__submit').removeAttr("disabled");
      $('#new_message')[0].reset(); 
    })
   
  })
 
  var reloadMessages = function () {
    if (window.location.href.match(/\/groups\/\d+\/messages/)){
      var last_message_id = $('.message:last').data('message-id');
      
      $.ajax({
        url: 'api/messages#index {:format=>"json"}',
        type: 'get',
        dataType: 'json',
        data: {message_id: last_message_id}
      })
        .done(function (messages) {
          
          var insertHTML = '';

          messages.forEach(function (message) {
            insertHTML = buildHTML(message);
            $('.messages').append(insertHTML);
            $('.messages').animate({ scrollTop: $('.messages')[0].scrollHeight }, 'fast');
          })
        })
        .fail(function () {
          alert('自動更新に失敗しました');
        });
           
    };
  }  
  setInterval(reloadMessages, 5000);

});
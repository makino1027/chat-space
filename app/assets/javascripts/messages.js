$(function() {

   function buildHTML(message) {
    var content = message.content ? `${ message.content }` : "";
    var img = message.image ? `<img class="lower-message__image" src= ${ message.image }>` : "";
    var html = `<div class="message">
                  <div class="upper-message">
                    <div class="upper-message__user-name">
                      ${ message.name }
                    </div>
                    <div class="upper-message__date">
                      ${message.created_at}
                    </div>
                  </div>
                  <div class="lower-message">
                    <p class="lower-message__content">
                      ${ message.content}
                    </p>
                  </div>               
                  <div class="lower-message">
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
    var url = window.location.href
    $.ajax({
      url: url,
      type: 'POST',
      data: formData,
      dataType: 'json',
      processData: false,
      contentType: false
    })
    .done(function(data){
      var html = buildHTML(data);
      $('.messages').append(html);
      $('.form__message').val(''); //input内のメッセージを消しています。
      $('.form__submit').prop('disabled', false);
      scrollBottom()
      $('.notification').empty();
      $('.notification').append('<div class="notice">メッセージを送信しました</div>')
    })
    .fail(function(data){
      alert('エラーが発生したためメッセージは送信できませんでした。');
      $('.form__submit').prop('disabled', false);
    })
  })
 
  });
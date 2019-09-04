$(function() {


    
  // var reloadMessages = function() {
  //   if (window.location.href.match(/\/groups\/\d+\/messages/)){
  //     //カスタムデータ属性を利用し、ブラウザに表示されている最新メッセージのidを取得
  //     last_message_id = $('.message:last').data('message-id');
  //     $.ajax({
  //       //ルーティングで設定した通り/groups/id番号/api/messagesとなるよう文字列を書く
  //       url: 'api/messages#index {:format=>"json"}',
  //       //ルーティングで設定した通りhttpメソッドをgetに指定
  //       type: 'get',
  //       dataType: 'json',
  //       //dataオプションでリクエストに値を含める
  //       data: {id: last_message_id}
  //     })
  //     .done(function(messages) {
  //       console.log('success');
  //     })
  //     .fail(function() {
  //       console.log('error');
  //     });
  //   };
  // }  
  // setInterval(reloadMessages, 5000);


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
      var html = buildHTML(data);
      $('.messages').append(html);
      $('#new_message')[0].reset(); 
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
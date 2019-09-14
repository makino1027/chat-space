  
$(document).on("turbolinks:load", function () {

  function buildHTML(message) {
    // var content = message.content ? `<p class="lower-message__content">${message.content}</p>` : "";
    console.log(message.id)
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
                  <p class="lower-message__content">${message.content}</p>
                    ${img}
                  </div>
                </div>`
      return html;
  }

  var reloadMessages = function () {
  if (window.location.href.match(/\/groups\/\d+\/messages/)){
    var last_message_id = $('.message:last').data('message-id') || 0;
    $.ajax({
      url: 'api/messages',
      type: 'get',
      dataType: 'json',
      data: {message_id: last_message_id}
    })
    .done(function (messages) {
      var insertHTML = '';
      if (messages.length > 0){
        messages.forEach(function (message) {
          insertHTML = buildHTML(message);
          $('.messages').append(insertHTML);
          $('.messages').animate({ scrollTop: $('.messages')[0].scrollHeight }, 'fast');
        })       
      } 
    })      
      .fail(function () {
        alert('自動更新に失敗しました');
      });
         
   };
  }
setInterval(reloadMessages, 5000);
});
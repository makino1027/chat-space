$(function () {

  var user_list = $("#user-search-result")
  var users_list = $("#add-group-users")
  function appendProduct(user) {
    var html = `<div class="chat-group-user clearfix">
                <p class="chat-group-user__name">${ user.name }</p>
                <div class="user-search-add chat-group-user__btn chat-group-user__btn--add" data-user-id="${ user.id }" data-user-name="${ user.name }">追加</div>
                </div>`
    user_list.append(html);
  }

  function appendErrMsgHTML(msg) {
    var html = `<div class="chat-group-user clearfix">
                <p class="chat-group-user__name">${ msg }</p>
                </div>`
  }

  function appendUser(name,id) {
    var html = `<div class='chat-group-user'>
                <input name='group[user_ids][]' class='add-user-value' type='hidden' value='${id}'>
                <p class='chat-group-user__name'>${name}</p>
                <div class='user-search-remove chat-group-user__btn chat-group-user__btn--remove js-remove-btn'>削除</div>
                </div>`
    users_list.append(html);
  }

  $("#user-search-field").on("keyup",function(){
    $('#user-search-result').empty()
    // 処理
    // inputの文字列を取ってくる
    var input = $(this).val();
    user_ids =[]
    var id = $('.chat-group-user .add-user-value').each(function (i, value){
      user_ids.push($(value).val());
    })
    // ajaxを送信
    $.ajax({
      type: 'GET',
      url: '/users',
      data: { keyword: input, user_ids: user_ids },
      dataType: 'json'
    })
      .done(function (users) {
      if (users.length !== 0) {
        users.forEach(function (user) {
          appendProduct(user);
        });
      }
      else {
        appendErrMsgHTML("userはいません");
      }
    })
    .fail(function() {
      alert('ユーザー検索に失敗しました');
    })
  });
  $("#user-search-result").on("click", ".chat-group-user__btn--add", function () { 
    //追加ボタンのidとなまえを取得
    var name = $(this).data('user-name');
    var id = $(this).data('user-id');
    $(this).parent().remove()
    //appendする
    appendUser(name,id)
  })
  $("#add-group-users").on('click', ".chat-group-user__btn--remove", function(){
    $(this).parent().remove()
  })

});
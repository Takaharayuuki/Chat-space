$(document).on('turbolinks:load', function(){

  function buildHTML(message) {
    var content = message.content ? `${ message.content }` : "";
    var img = message.image ? `<img src= ${ message.image }>` : "";
    
    var html = `<div class="message" data-message-id="${message.id}>
                  <div class="message__upper-info">
                    <div class="message__upper-info__talker">
                    ${message.user_name}
                    </div>
                    <div class="message__upper-info__date">
                      ${ message.data } 
                    </div>
                  </div>
                  <div class="message__text">
                      <p class="lower-message__content">
                        ${ content }
                      </p>
                    ${img}
                  </div>
                </div>
  `
  return html;
  }


  $('#new_message').on('submit', function(e){
    e.preventDefault();
    var message = new FormData(this);
    var url = (window.location.href);
    $.ajax({  
      url: url,
      type: 'POST',
      data: message,
      dataType: 'json',
      processData: false,
      contentType: false
    })
    .done(function(data){
      var html = buildHTML(data);
      $('.messages').append(html);
      $('#new_message')[0].reset();
      scrollBottom();
      function scrollBottom(){
        var target = $('.message').last();
        var position = target.offset().top + $('.messages').scrollTop();
        $('.messages').animate({
          scrollTop: position
        }, 300, 'swing');
      }

    })
    .fail(function(data){
      alert('エラーが発生したためメッセージは送信できませんでした。');
    })
    .always(function(data){
      $('.submit-btn').prop('disabled', false);
    })
  })





  var reloadMessages = function() {
      var last_message_id = $('.message:last').data("message-id");
      var group_id = $(".main-header__left-box__current-group").data("group-id")
      $.ajax({
        url: `api/messages`,
        type: 'GET',
        dataType: 'json',
        data: {id: last_message_id}
      })

      .done(function(messages) {
        var insertHTML = '';
          messages.forEach(function (message){
            insertHTML = buildHTML(message);
            $('.messages').append(insertHTML);
            $('.messages').animate({scrollTop: $('.messages')[0].scrollHeight}, 'fast');
            
        })
      })
      .fail(function () {
        alert('自動更新に失敗しました');
        });
      };

    var interval = setInterval(function(){
    if (window.location.href.match(/\/groups\/\d+\/messages/)){
    reloadMessages();
    }else{
    clearInterval(interval);
    }

    },5000);
});
json.id      @message.id
json.content @message.content 
json.data    @message.created_at.to_s
json.user_name @message.user.name
json.image   @message.image.url
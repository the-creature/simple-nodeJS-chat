      var socket = io();

      socket.on('newUser', function(name){
        $('#messages').append($('<li class="clearfix">').text('-----[ ' + name + ' joined ]-----'));
      });

      socket.on('chat message', function(obj){
        var template = Handlebars.compile($("#message-template").html());
        $('#messages').append(template(obj));
      }); 

      socket.on('userNames', function(arr){              
        $('.js-list').html('');

        for (var i = 0; i < arr.length; i++) {
          var newAvatar = '<img src="http://www.sernetindia.com/image/testimonial/u_icon.png" width="55" alt="avatar" /><div class="about"><div class="name">'+arr[i]+'</div><div class="status"><i class="fa fa-circle online"></i> online</div></div>';  

          $('.js-list').append($('<li class="clearfix">').html(newAvatar));
        };          
      });     

      $('#message-to-send').on('keyup', function() {
        if (event.keyCode === 13) {
          socket.emit('chat message', $('#message-to-send').val());
          $('#message-to-send').val('');
          return false;
        }        
      });

      $('form').submit(function(){
        socket.emit('chat message', $('#message-to-send').val());
        $('#message-to-send').val('');
        return false;
      });

      function myFunction() {
          var person = prompt("Please enter your name", "");
          
          if (person != null)
              socket.emit('name', person);
      }

      myFunction();



      var searchFilter = {
        options: {
          valueNames: ['name']
        },
        init: function() {
          var userList = new List('people-list', this.options);
          var noItems = $('<li id="no-items-found">No items found</li>');

          userList.on('updated', function(list) {
            if (list.matchingItems.length === 0) {
              $(list.list).append(noItems);
            } else {
              noItems.detach();
            }
          });
        }
      };

      searchFilter.init();
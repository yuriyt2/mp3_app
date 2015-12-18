//++++++++++++++++++++++++++++++++Login Controls++++++++++++++++++++++++++++++++++++++

  //hide the app until user logs in
  $userControls.hide();

  //login button - create new session
  $('#submit').on('click', function(e){
    e.preventDefault();
    $.post('/sessions', {
      username:$('#user-input').val(),
      password:$('#password-input').val()
    })
      .success(function(usr){
        loggedInUser = usr[0]
        userLoggedIn(usr)
      })
      .fail(function(err) {
        var errorMessage = $('<div>')
        errorMessage.html(err)
        $loginControls.append(errorMessage);
      })
  })

  //create new account button
  $('#create').on('click', function(e){
    e.preventDefault();
    var passConfirm = $('<input class="login" id="pass-conf-input" type="password" value required>');
    var label = $('<label class="login" for="pass-conf-input">');
    $('#password-input').after(label);
    label.text('confirm password');
    $(label).after(passConfirm)

    $('#create').hide()
    $('#submit').hide()
    passConfirm.after('<button class="login" id="create-account" type="submit">Create Account</button>')

    $('#create-account').on('click', function(e){
    e.preventDefault()
    if ($('#pass-conf-input').val() == $('#password-input').val()){
    $.post('/users', {
        username:$('#user-input').val(),
        password:$('#password-input').val()
        })
      .success(function(res) {
        var successMessage = $('<div>')
        successMessage.text(res)
        $loginControls.append(successMessage)
        $('#create-account').hide()
        $('#submit').show()
        passConfirm.hide()
        label.hide()
      })
      .fail(function(err) {
        console.log(arguments)
        var errorMessage = $('<div>')
        errorMessage.html(err)
        $loginControls.append(errorMessage);
      })
    } else {
      var errorMessage = $('<div>')
      errorMessage.text("The passwords did not match.")
      $loginControls.append(errorMessage);
    }
  })
  })

  //Logout
    $('#logout').on('click', function(){
      $.ajax({
        url: "/sessions",
        method: "DELETE"
      })
        .done(function(){
          window.location.href = "/"
      })
        .fail(function(err){
        console.log(err)
      })
    })

  //When a user tries to log in, this function either lets them in or populates an error message.
  var userLoggedIn = function (res) {
    //if the server sends a username success.
    if (res[0].username){
    $userControls.show();
    $loginControls.hide();
    userLoginControl()
    //else log the error message
    }else {
      var errorMessage = $('<div>');
      errorMessage.html(res);
      $loginControls.append(errorMessage);
    }
  }

//This controller directs the user to the correct step depending on their level of integration with Dropbox.
  var userLoginControl = function (){
    getToken();
    if (userToken.length > 2){
      getCurrentUser()
      populateSongList();
      setUpMusicPlayer();
      setTimeout(function(){
        if (userSongList.length === 0){
          sendMessage(["Welcome!  Upload mp3s to your Dropbox and update your song list to continue.","This may take a few minutes to complete.  Make sure your MP3s are in the remote_music_app folder inside Dropbox's Apps folder."])
        }else {
          sendMessage(["Welcome!  Add songs to your playlist to play your tunes!","If you make changes to your music folder on Dropbox, press the update songs button."])
        }
      },500);
    }else {
      sendMessage(["Welcome!  Please connect to Dropbox to continue.","Press the button in the upper left corner and log back in to MP3 Trove after connecting to Dropbox."])
    }
  }


  var getToken = function (){
    if (window.location.href.match('\access_token=(.+)\&t')){
    userToken = window.location.href.match('\access_token=(.+)\&t')[1];
    }else{
    userToken = 0;
    }
  }

//sets the user's name based on their first name on Dropbox
  var getCurrentUser = function () {
    $.ajax({
      url: 'https://api.dropboxapi.com/1/account/info',
      dataType: "json",
      method: 'GET',
      headers: {'Authorization': 'Bearer ' + userToken}
    }).done(function(data){
      if (data){
        setName(data.display_name.split(" ")[0]);
      }else{
        console.log("Token doesn't work")
      }
    }).fail(function(err) {
      console.log(err);
    })
}

//---------------------------------------------------------------------------------------------

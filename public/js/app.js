console.log("app.js");

//Assign variables to DOM elements and user options
var $userControls = $('#user-controls');
var $loginControls = $('#login');
var $nameDiv = $('#name-div');
var $songList = $('#song-list');
var $addSongButton = $('#add-song-button');
var $removeSongButton = $('#remove-song-button');
var $playlistSelect = $('#playlist');
var $deletePlaylist = $('#delete-playlist-button');
var $messageField = $('#message-div');

//Dropbox
var $updateSongs = $('#update-songs');

//User variables
var loggedInUser = "";
var userToken = "";
var userSongList = [];
var playList = [];
var currentSong = {};
var songFileNames = []; //to be used to get filenames from dropbox
var songObjects = [];   //to be used in the creation process of songs
var soundObject = {};
var degrees = 0;
var muFasa = $('<img id=mufasa src="http://dash.ponychan.net/chan/files/src/136167943291.gif"/>')
$(muFasa).hide()

//------ Onload function to assign events to all buttons ----------------------------
$(function(){
//+++++++++++Navbar Controls++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//This button should only be used for new users or when a user's dropbox was updated with new songs.
$updateSongs.on('click', getSongFileNames);
//++++++++++++++ User interaction controls +++++++++++++++++++++++++++++++++++++++

//adds a song to the playlist
$addSongButton.on('click', function(){
  var index = null;
  userSongList.forEach(function(song){
    if (song.id == parseInt($songList.val())){
    index = userSongList.indexOf(song);
  }
})
  makeNewTempLink( userSongList[index] );
})

//delets a song from the playlist
$removeSongButton.on('click', removeSelectedSong);

//clears playlist
$deletePlaylist.on('click', function(){
  playList = [];
  updatePlaylist();
})

//close the onload function:
})
//--------------------------------------------------------------------------------

//++++++++++++++ Main App controls +++++++++++++++++++++++++++++++++++++++++++++++
var sendMessage = function (array) {
  var messageOne = $('<h2>')
  var messageTwo = $('<h5>')
  messageOne.text(array[0])
  messageTwo.text(array[1])
  $($messageField).append(messageOne)
  $($messageField).append(messageTwo)
}

//Set the user's name on the top nav bar
var setName = function (name){
  $nameDiv.text(name)
}

//Set up user song list with songs from an array.
var loadLibrary = function (songs) {
  songs.forEach(function(song){
    console.log(song)
    var $song = $('<option>');
    $song.attr('value',song.id)
    $song.text(song.artist + " - " + song.title);
    $songList.append($song);
  })
}

//Update playlist on the front end based on what is in the playlist array.
var updatePlaylist = function () {
  $('.songs').remove()
  playList.forEach(function(song){
    var $song = $('<option class="songs">');
    $song.attr('value',song.id)
    $song.text(song.artist + " - " + song.title);
    $playlistSelect.append($song);
  })

}
//--------------------------------------------------------------------------------

//++++++++++++++ Update User Songs +++++++++++++++++++++++++++++++++++++++++++++++

//This is the first step in adding songs to a user.  This is used to create an array
//of all the filepaths to the songs a user uploaded to dropbox.
var getSongFileNames = function () {
  console.log("get song names")
  getToken()
  $.ajax({
    url: 'https://api.dropboxapi.com/1/metadata/auto/?&include_media_info=true&include_membership=true&list=true',
    dataType: "json",
    method: 'GET',
    headers: {'Authorization': 'Bearer ' + userToken}
  }).done(function(data){
    data.contents.forEach(function(name){
    songFileNames.push(name.path)
    })
  }).fail(function(err) {
    console.log(err);
  })
  setTimeout(function(){makeSongObjects(songFileNames)},5000)
}

//The 2nd step to adding songs is to turn all the paths into song objects.
var makeSongObjects = function (array) {
  for (var i = 0; i < array.length; i++) {
    songObjects.push({id:i,filepath:array[i],tempUrl:null,artist:null,title:null,album:null,year:null})
  }
  console.log("Song Objects Made")
  addTempLinks(songObjects,0)
}

// Add temp links to all the song objects.  Will be used to read ID3 tags.
var addTempLinks = function (array,num){
  if (num == array.length-1){
    console.log('Temp links added!')
  }else{
  var link = ""
  $.ajax({
    url: 'https://api.dropboxapi.com/1/media/auto' + array[num].filepath,
    dataType: "json",
    method: 'POST',
    headers: {'Authorization': 'Bearer ' + userToken}
  }).done(function(data){
      console.log("link created" + data.url)
      array[num].tempUrl = data.url
      addTempLinks(array,num+1)
      if (num == 2){
        updateUserSongList(0)
      }
  })
    .fail(function(err) {
      console.log(err);
  })
 }
}

//Read the ID3 tags and save the relevant track info for each song.
var updateUserSongList = function (num) {
  console.log("Update " + num)
  if (num === songObjects.length-1){
    saveUserSongs();
    updateSongList();
  }else if (songObjects[num].title !== null){
    updateUserSongList(num+1);
  } else {
    var fileurl = songObjects[num].tempUrl;
    ID3.loadTags(fileurl, function() {
        tags = ID3.getAllTags(fileurl);
        songObjects[num].title = tags.title;
        songObjects[num].artist = tags.artist;
        songObjects[num].album = tags.album;
        updateUserSongList(num+1);
    }, {
        onError: function(reason) {
          updateUserSongList(num+1);
            }
        })
    }
}

//Save song data to db.  Array is sent as string to be JSON.parsed by server.
var saveUserSongs = function () {
  $.ajax({
    url: "/users/" + loggedInUser._id,
    method: "PUT",
    data: {songs:JSON.stringify(songObjects)}
  }).success(function(log){
    console.log(log);
    populateSongList()
  }).fail(function(){
    console.log("fail");
  })
}


var updateSongList = function (){
  userSongList.forEach(function(song){
    var $song = $('<option value=' + song.id + '>');
    $song.text(song.artist + " - " + song.title);
    $songList.append($song);
  })
console.log("song list updated front end")
}


var populateSongList = function () {
  $.ajax({
    url: "/users/" + loggedInUser._id,
    method: "GET",
  }).success(function(data){
    console.log(data);
    userSongList = null;
    userSongList = data[0].songs;
    //sort songs by artist alphabetically
      function compare(a,b) {
        if (a.artist < b.artist){
          return -1};
        if (a.artist > b.artist){
          return 1};
        return 0;
      }
      userSongList = userSongList.sort(compare);

    updateSongList();
  }).fail(function(){
    console.log("fail");
  })
}

// Create new temp link and add song to playlist.
var makeNewTempLink = function (song) {
  var link = ""
  $.ajax({
    url: 'https://api.dropboxapi.com/1/media/auto' + song.filepath,
    dataType: "json",
    method: 'POST',
    headers: {'Authorization': 'Bearer ' + userToken}
  }).done(function(data){
      console.log("link created" + data.url)
      link = data.url
      song.tempUrl = link
      playList.push(song);
      updatePlaylist();
  })
    .fail(function(err) {
      console.log(err);
  })
}


var assignCurrentSong = function(song){
  currentSong = song;
}

var playSong = function(){
  soundObject.url = currentSong.tempUrl;
  soundObject.togglePause();
}

var removeSelectedSong = function(){
  var songSelected = $playlistSelect.val();
  var index = null;
  var deleteSongFromArray = function () {
    if (index !== null){
      playList.splice(index,1);
    }
  }
  playList.forEach(function(song){
    if (song.id == songSelected){
    index = playList.indexOf(song);
  }
})
  deleteSongFromArray();
  updatePlaylist();
}


var rotateImage = function () {
  $('#red-button').on('click', function(){
    rotateImage = rotateImage2;
  })
}

var rotateImage2 = function () {
  $('#mufasa').attr('width',"125px");
  setTimeout(function(){$(muFasa).show()},300);
  $('#record').append(muFasa);
  degrees += 90;
  $('#mufasa').css('transform','rotate('+ degrees +'deg)');
  setTimeout(function(){$(muFasa).show($('#mufasa').remove())},3000);
}

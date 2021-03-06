//++++++++++++++ Music player controls +++++++++++++++++++++++++++++++++++++++

  $("#play, #play-2").on('click', function(){
    if (!currentSong.title && playList.length > 0){
      assignCurrentSong(playList[0]);
    }else if (playList.length === 0){
      alert("Nothing to play.  You have no songs in your playlist.")
    }
    playSong()
  })

  $("#stop, #stop-2").on('click', function(){
    soundObject.stop();
  })
  $("#volume").change(function(){
    soundObject.setVolume(parseInt($("#volume").val()));
  })
  $("#position").change(function(){
    soundManager.setPosition(soundObject.id,parseInt(Math.floor($("#position").val())/100 * soundObject.durationEstimate));
  })
  $("#back, #back-2").on('click', function(){
    if (soundObject.position > 4000){
      soundManager.setPosition('song',0)
    }else {
      soundObject.stop();
      assignCurrentSong(playList[playList.indexOf(currentSong)-1]);
      soundObject.url = currentSong.tempUrl;
      soundObject.play();
    }
  })
  $("#forward, #forward-2").on('click', function(){
    soundObject.stop();
    assignCurrentSong(playList[playList.indexOf(currentSong)+1]);
    soundObject.url = currentSong.tempUrl;
    soundObject.play();
  })

  $("#playlist").on('dblclick', function(e){
    soundObject.stop()
    console.log(e.target)
    var clickedSong = null
    playList.forEach(function(song){
      if (song.id == e.target.value){
        clickedSong = playList[playList.indexOf(song)]
        assignCurrentSong(clickedSong)
      }
    })
    playSong()
  })

//++++++++++++++ Set up music player  +++++++++++++++++++++++++++++++++++++++

  var setUpMusicPlayer = function () {
    //mp3 player:
     soundManager.setup({
      flashVersion: 9,
      // preferFlash: false,
      onready: function() {

        soundObject = soundManager.createSound({
          id: "song",
          url: '',
          onfinish: function(){

          if (playList.indexOf(currentSong)+1 === playlist.length){
            assignCurrentSong(playList[0])
          }else{
          assignCurrentSong(playList[playList.indexOf(currentSong)+1]);
          soundObject.url = currentSong.tempUrl;
        };
          playSong()
        },
        whileplaying: function(){
          $("#position").val(soundObject.position/soundObject.durationEstimate * 100)

          rotateImage()
        }

        });
      }
    });
  }

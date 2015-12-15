console.log("app.js");

//ID3 tag reader, had to fix the file a little bit to make it work.
(function(){var e=function(t){this.type=t||e.OPEN_URI;this.size=null;this.file=null};e.OPEN_FILE=1;e.OPEN_URI=2;e.OPEN_LOCAL=3;if(typeof require==="function"){var t=require("fs")}e.prototype.open=function(i,r){this.file=i;var n=this;switch(this.type){case e.OPEN_LOCAL:t.stat(this.file,function(e,i){if(e){return r(e)}n.size=i.size;t.open(n.file,"r",function(e,t){if(e){return r(e)}n.fd=t;r()})});break;case e.OPEN_FILE:this.size=this.file.size;r();break;default:this.ajax({uri:this.file,type:"HEAD"},function(e,t,i){if(e){return r(e)}n.size=parseInt(i.getResponseHeader("Content-Length"));r()});break}};e.prototype.close=function(){if(this.type===e.OPEN_LOCAL){t.close(this.fd)}};e.prototype.read=function(t,i,r){if(typeof i==="function"){r=i;i=0}if(this.type===e.OPEN_LOCAL){this.readLocal(t,i,r)}else if(this.type===e.OPEN_FILE){this.readFile(t,i,r)}else{this.readUri(t,i,r)}};e.prototype.readBlob=function(e,t,i,r){if(typeof t==="function"){r=t;t=0}else if(typeof i==="function"){r=i;i="application/octet-stream"}this.read(e,t,function(e,t){if(e){r(e);return}r(null,new Blob([t],{type:i}))})};e.prototype.readLocal=function(e,i,r){var n=new Buffer(e);t.read(this.fd,n,0,e,i,function(e,t,i){if(e){return r(e)}var n=new ArrayBuffer(i.length),a=new Uint8Array(n);for(var l=0;l<i.length;l++){a[l]=i[l]}r(null,n)})};e.prototype.ajax=function(e,t){var i={type:"GET",uri:null,responseType:"text"};if(typeof e==="string"){e={uri:e}}for(var r in e){i[r]=e[r]}var n=new XMLHttpRequest;n.onreadystatechange=function(){if(n.readyState!==4)return;if(n.status!==200&&n.status!==206){return t("Received non-200/206 response ("+n.status+")")}t(null,n.response,n)};n.responseType=i.responseType;n.open(i.type,i.uri,true);if(i.range){i.range=[].concat(i.range);if(i.range.length===2){n.setRequestHeader("Range","bytes="+i.range[0]+"-"+i.range[1])}else{n.setRequestHeader("Range","bytes="+i.range[0])}}n.send()};e.prototype.readUri=function(e,t,i){this.ajax({uri:this.file,type:"GET",responseType:"arraybuffer",range:[t,t+e-1]},function(e,t){if(e){return i(e)}return i(null,t)})};e.prototype.readFile=function(e,t,i){var r=this.file.slice(t,t+e),n=new FileReader;n.onload=function(e){i(null,e.target.result)};n.onerror=function(e){i("File read failed")};n.readAsArrayBuffer(r)};DataView.prototype.getString=function(e,t,i){t=t||0;e=e||this.byteLength-t;if(e<0){e+=this.byteLength}var r="";if(typeof Buffer!=="undefined"){var n=[];for(var a=t;a<t+e;a++){n.push(this.getUint8(a))}return new Buffer(n).toString()}else{for(var a=t;a<t+e;a++){r+=String.fromCharCode(this.getUint8(a))}if(i){return r}return decodeURIComponent(encodeURIComponent(r))}};DataView.prototype.getStringUtf16=function(e,t,i){t=t||0;e=e||this.byteLength-t;var r=false,n="",a=false;if(typeof Buffer!=="undefined"){n=[];a=true}if(e<0){e+=this.byteLength}if(i){var l=this.getUint16(t);if(l===65534){r=true}t+=2;e-=2}for(var o=t;o<t+e;o+=2){var s=this.getUint16(o,r);if(s>=0&&s<=55295||s>=57344&&s<=65535){if(a){n.push(s)}else{n+=String.fromCharCode(s)}}else if(s>=65536&&s<=1114111){s-=65536;if(a){n.push(((1047552&s)>>10)+55296);n.push((1023&s)+56320)}else{n+=String.fromCharCode(((1047552&s)>>10)+55296)+String.fromCharCode((1023&s)+56320)}}}if(a){return new Buffer(n).toString()}else{return decodeURIComponent(encodeURIComponent(n))}};DataView.prototype.getSynch=function(e){var t=0,i=2130706432;while(i){t>>=1;t|=e&i;i>>=8}return t};DataView.prototype.getUint8Synch=function(e){return this.getSynch(this.getUint8(e))};DataView.prototype.getUint32Synch=function(e){return this.getSynch(this.getUint32(e))};DataView.prototype.getUint24=function(e,t){if(t){return this.getUint8(e)+(this.getUint8(e+1)<<8)+(this.getUint8(e+2)<<16)}return this.getUint8(e+2)+(this.getUint8(e+1)<<8)+(this.getUint8(e)<<16)};var i=function(t,r){var n={type:i.OPEN_URI};if(typeof t==="string"){t={file:t,type:i.OPEN_URI}}else if(typeof window!=="undefined"&&window.File&&t instanceof window.File){t={file:t,type:i.OPEN_FILE}}for(var a in t){n[a]=t[a]}if(!n.file){return r("No file was set")}if(n.type===i.OPEN_FILE){if(typeof window==="undefined"||!window.File||!window.FileReader||typeof ArrayBuffer==="undefined"){return r("Browser does not have support for the File API and/or ArrayBuffers")}}else if(n.type===i.OPEN_LOCAL){if(typeof require!=="function"){return r("Local paths may not be read within a browser")}}else{}var l=["Blues","Classic Rock","Country","Dance","Disco","Funk","Grunge","Hip-Hop","Jazz","Metal","New Age","Oldies","Other","Pop","R&B","Rap","Reggae","Rock","Techno","Industrial","Alternative","Ska","Death Metal","Pranks","Soundtrack","Euro-Techno","Ambient","Trip-Hop","Vocal","Jazz+Funk","Fusion","Trance","Classical","Instrumental","Acid","House","Game","Sound Clip","Gospel","Noise","AlternRock","Bass","Soul","Punk","Space","Meditative","Instrumental Pop","Instrumental Rock","Ethnic","Gothic","Darkwave","Techno-Industrial","Electronic","Pop-Folk","Eurodance","Dream","Southern Rock","Comedy","Cult","Gangsta Rap","Top 40","Christian Rap","Pop / Funk","Jungle","Native American","Cabaret","New Wave","Psychedelic","Rave","Showtunes","Trailer","Lo-Fi","Tribal","Acid Punk","Acid Jazz","Polka","Retro","Musical","Rock & Roll","Hard Rock","Folk","Folk-Rock","National Folk","Swing","Fast  Fusion","Bebob","Latin","Revival","Celtic","Bluegrass","Avantgarde","Gothic Rock","Progressive Rock","Psychedelic Rock","Symphonic Rock","Slow Rock","Big Band","Chorus","Easy Listening","Acoustic","Humour","Speech","Chanson","Opera","Chamber Music","Sonata","Symphony","Booty Bass","Primus","Porn Groove","Satire","Slow Jam","Club","Tango","Samba","Folklore","Ballad","Power Ballad","Rhythmic Soul","Freestyle","Duet","Punk Rock","Drum Solo","A Cappella","Euro-House","Dance Hall","Goa","Drum & Bass","Club-House","Hardcore","Terror","Indie","BritPop","Negerpunk","Polsk Punk","Beat","Christian Gangsta Rap","Heavy Metal","Black Metal","Crossover","Contemporary Christian","Christian Rock","Merengue","Salsa","Thrash Metal","Anime","JPop","Synthpop","Rock/Pop"];var o={};o.types={TALB:"album",TBPM:"bpm",TCOM:"composer",TCON:"genre",TCOP:"copyright",TDEN:"encoding-time",TDLY:"playlist-delay",TDOR:"original-release-time",TDRC:"recording-time",TDRL:"release-time",TDTG:"tagging-time",TENC:"encoder",TEXT:"writer",TFLT:"file-type",TIPL:"involved-people",TIT1:"content-group",TIT2:"title",TIT3:"subtitle",TKEY:"initial-key",TLAN:"language",TLEN:"length",TMCL:"credits",TMED:"media-type",TMOO:"mood",TOAL:"original-album",TOFN:"original-filename",TOLY:"original-writer",TOPE:"original-artist",TOWN:"owner",TPE1:"artist",TPE2:"band",TPE3:"conductor",TPE4:"remixer",TPOS:"set-part",TPRO:"produced-notice",TPUB:"publisher",TRCK:"track",TRSN:"radio-name",TRSO:"radio-owner",TSOA:"album-sort",TSOP:"performer-sort",TSOT:"title-sort",TSRC:"isrc",TSSE:"encoder-settings",TSST:"set-subtitle",TAL:"album",TBP:"bpm",TCM:"composer",TCO:"genre",TCR:"copyright",TDY:"playlist-delay",TEN:"encoder",TFT:"file-type",TKE:"initial-key",TLA:"language",TLE:"length",TMT:"media-type",TOA:"original-artist",TOF:"original-filename",TOL:"original-writer",TOT:"original-album",TP1:"artist",TP2:"band",TP3:"conductor",TP4:"remixer",TPA:"set-part",TPB:"publisher",TRC:"isrc",TRK:"track",TSS:"encoder-settings",TT1:"content-group",TT2:"title",TT3:"subtitle",TXT:"writer",WCOM:"url-commercial",WCOP:"url-legal",WOAF:"url-file",WOAR:"url-artist",WOAS:"url-source",WORS:"url-radio",WPAY:"url-payment",WPUB:"url-publisher",WAF:"url-file",WAR:"url-artist",WAS:"url-source",WCM:"url-commercial",WCP:"url-copyright",WPB:"url-publisher",COMM:"comments",APIC:"image",PIC:"image"};o.imageTypes=["other","file-icon","icon","cover-front","cover-back","leaflet","media","artist-lead","artist","conductor","band","composer","writer","location","during-recording","during-performance","screen","fish","illustration","logo-band","logo-publisher"];o.parse=function(e,t,i){i=i||0;t=t||4;var r={tag:null,value:null},n=new DataView(e);if(t<3){return o.parseLegacy(e)}var a={id:n.getString(4),type:n.getString(1),size:n.getUint32Synch(4),flags:[n.getUint8(8),n.getUint8(9)]};if(a.flags[1]!==0){return false}if(!a.id in o.types){return false}r.tag=o.types[a.id];if(a.type==="T"){var s=n.getUint8(10);if(s===0||s===3){r.value=n.getString(-11,11)}else if(s===1){r.value=n.getStringUtf16(-11,11,true)}else if(s===2){r.value=n.getStringUtf16(-11,11)}else{return false}if(a.id==="TCON"&&!!parseInt(r.value)){r.value=l[parseInt(r.value)]}}else if(a.type==="W"){r.value=n.getString(-10,10)}else if(a.id==="COMM"){var s=n.getUint8(10),u=14,f=0;for(var g=u;;g++){if(s===1||s===2){if(n.getUint16(g)===0){u=g+2;break}g++}else{if(n.getUint8(g)===0){u=g+1;break}}}if(s===0||s===3){r.value=n.getString(-1*u,u)}else if(s===1){r.value=n.getStringUtf16(-1*u,u,true)}else if(s===2){r.value=n.getStringUtf16(-1*u,u)}else{return false}}else if(a.id==="APIC"){var s=n.getUint8(10),c={type:null,mime:null,description:null,data:null};var u=11,f=0;for(var g=u;;g++){if(n.getUint8(g)===0){f=g-u;break}}c.mime=n.getString(f,u);c.type=o.imageTypes[n.getUint8(u+f+1)]||"other";u+=f+2;f=0;for(var g=u;;g++){if(n.getUint8(g)===0){f=g-u;break}}c.description=f===0?null:n.getString(f,u);c.data=e.slice(u+1);r.value=c}return r.tag?r:false};o.parseLegacy=function(e){var t={tag:null,value:null},i=new DataView(e),r={id:i.getString(3),type:i.getString(1),size:i.getUint24(3)};if(!r.id in o.types){return false}t.tag=o.types[r.id];if(r.type==="T"){var n=i.getUint8(7);t.value=i.getString(-7,7);if(r.id==="TCO"&&!!parseInt(t.value)){t.value=l[parseInt(t.value)]}}else if(r.type==="W"){t.value=i.getString(-7,7)}else if(r.id==="COM"){var n=i.getUint8(6);t.value=i.getString(-10,10);if(t.value.indexOf("\x00")!==-1){t.value=t.value.substr(t.value.indexOf("\x00")+1)}}else if(r.id==="PIC"){var n=i.getUint8(6),a={type:null,mime:"image/"+i.getString(3,7).toLowerCase(),description:null,data:null};a.type=o.imageTypes[i.getUint8(11)]||"other";var s=11,u=0;for(var f=s;;f++){if(i.getUint8(f)===0){u=f-s;break}}a.description=u===0?null:i.getString(u,s);a.data=e.slice(s+1);t.value=a}return t.tag?t:false};var s={};s.parse=function(e,t){var i={title:null,album:null,artist:null,year:null,v1:{title:null,artist:null,album:null,year:null,comment:null,track:null,version:1},v2:{version:[null,null]}},r={v1:false,v2:false},n=function(e){if(r.v1&&r.v2){i.title=i.v2.title||i.v1.title;i.album=i.v2.album||i.v1.album;i.artist=i.v2.artist||i.v1.artist;i.year=i.v1.year;t(e,i)}};e.read(128,e.size-128,function(e,t){if(e){return n("Could not read file")}var a=new DataView(t);if(t.byteLength!==128||a.getString(3,null,true)!=="TAG"){r.v1=true;return n()}i.v1.title=a.getString(30,3).replace(/(^\s+|\s+$)/,"")||null;i.v1.artist=a.getString(30,33).replace(/(^\s+|\s+$)/,"")||null;i.v1.album=a.getString(30,63).replace(/(^\s+|\s+$)/,"")||null;i.v1.year=a.getString(4,93).replace(/(^\s+|\s+$)/,"")||null;if(a.getUint8(125)===0){i.v1.comment=a.getString(28,97).replace(/(^\s+|\s+$)/,"");i.v1.version=1.1;i.v1.track=a.getUint8(126)}else{i.v1.comment=a.getString(30,97).replace(/(^\s+|\s+$)/,"")}i.v1.genre=l[a.getUint8(127)]||null;r.v1=true;n()});e.read(14,0,function(t,a){if(t){return n("Could not read file")}var l=new DataView(a),s=10,u=0,f;if(a.byteLength!==14||l.getString(3,null,true)!=="ID3"||l.getUint8(3)>4){r.v2=true;return n()}i.v2.version=[l.getUint8(3),l.getUint8(4)];f=l.getUint8(5);if((f&128)!==0){r.v2=true;return n()}if((f&64)!==0){s+=l.getUint32Synch(11)}u+=l.getUint32Synch(6);e.read(u,s,function(e,t){if(e){r.v2=true;return n()}var a=new DataView(t),l=0;while(l<t.byteLength){var s,u,f,g=true;for(var c=0;c<3;c++){f=a.getUint8(l+c);if((f<65||f>90)&&(f<48||f>57)){g=false}}if(!g)break;if(i.v2.version[0]<3){u=t.slice(l,l+6+a.getUint24(l+3))}else{u=t.slice(l,l+10+a.getUint32Synch(l+4))}s=o.parse(u,i.v2.version[0]);if(s){i.v2[s.tag]=s.value}l+=u.byteLength}r.v2=true;n()})})};var u=new e(n.type);u.open(n.file,function(e){if(e){return r("Could not open specified file")}s.parse(u,function(e,t){r(e,t);u.close()})})};i.OPEN_FILE=e.OPEN_FILE;i.OPEN_URI=e.OPEN_URI;i.OPEN_LOCAL=e.OPEN_LOCAL;if(typeof module!=="undefined"&&module.exports){module.exports=i}else{if(typeof define==="function"&&define.amd){define("id3",[],function(){return i})}else{window.id3=i}}})();
//---------------------------------------------------------------------------------

//Assign variables to DOM elements and user options
var $userControls = $('#user-controls');
var $loginControls = $('#login');
var $nameDiv = $('#name-div');
var $songList = $('#song-list');
var $addSongButton = $('#add-song-button');
var $removeSongButton = $('#remove-song-button');
var $playlistSelect = $('#playlist');

//Dropbox
var $updateSongs = $('#update-songs')

//User variables
var loggedInUser = "";
var userToken = "";
var userSongList = [];
var playList = [];
var currentSong = {};
var songFileNames = []; //to be used to get filenames from dropbox
var songObjects = [];   //to be used in the creation process of songs
var soundObject = {};



//------ Onload function to assign events to all buttons ----------------------------

$(function(){

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
    label.text('Confirm Password');
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


//+++++++++++Dropbox Controls++++++++++++++++++++++++++++++++++++++++++++++++++++++++

$updateSongs.on('click', getSongFileNames);


  $("#droppost").on('click',function(){
    getToken()
    $.ajax({
      url: 'https://api.dropboxapi.com/1/metadata/auto/?&include_media_info=true&include_membership=true&list=true',
      dataType: "json",
      method: 'GET',
      headers: {'Authorization': 'Bearer ' + userToken}
    }).done(function(data){
      username = data
      console.log(username)
    }).fail(function(err) {
      console.log(err);
    })
  })





//++++++++++++++ User interaction controls +++++++++++++++++++++++++++++++++++++++

$addSongButton.on('click', function(){
  var index = null
  userSongList.forEach(function(song){
    if (song.id == parseInt($songList.val())){
    index = userSongList.indexOf(song);
  }
})
  makeNewTempLink( userSongList[index] );
})

$removeSongButton.on('click', removeSelectedSong);



//++++++++++++++ Music player controls +++++++++++++++++++++++++++++++++++++++

  $("#play").on('click', function(){
    if (!currentSong.title && playList.length > 0){
      assignCurrentSong(playList[0]);
      console.log(currentSong.title + playList.length + 168)
    }
    playSong()
  })

  $("#stop").on('click', function(){
    soundObject.stop();
  })
  $("#volume").change(function(){
    soundObject.setVolume(parseInt($("#volume").val()));
  })
  $("#position").change(function(){
    soundManager.setPosition(soundObject.id,parseInt(Math.floor($("#position").val())/100 * soundObject.durationEstimate));
  })
  $("#back").on('click', function(){
    if (soundObject.position > 4000){
      soundManager.setPosition('song',0)
    }else {
      soundObject.stop();
      assignCurrentSong(playList[playList.indexOf(currentSong)-1]);
      soundObject.url = currentSong.tempUrl;
      soundObject.play();
    }
  })
  $("#forward").on('click', function(){
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

//close the onload function:
})
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

var getToken = function (){
  result = window.location.href.match('\access_token=(.+)\&t')[1]
  userToken = result
}

var userLoggedIn = function (msg) {
  console.log("userLoggedIn hit")
  if (msg[0].username || msg == "User logged in."){
  $userControls.show()
  $loginControls.hide()
  populateSongList()
  setUpMusicPlayer()
  getToken()
  }else {
    var errorMessage = $('<div>')
    errorMessage.html(msg)
    $loginControls.append(errorMessage);
  }
}


var checkIfTokenWorks = function (tok) {

    $.ajax({
      url: 'https://api.dropboxapi.com/1/account/info',
      dataType: "json",
      method: 'GET',
      headers: {'Authorization': 'Bearer ' + tok}
    }).done(function(data){
      if (data){
        setName(data.display_name.split(" ")[0]);
        loadLibrary(userSongList);
      }else{
        console.log("Token doesn't work")
      }
    }).fail(function(err) {
      console.log(err);
    })
}

var setName = function (name){
  $nameDiv.text(name)
}

var loadLibrary = function (songs) {
  songs.forEach(function(song){
    console.log(song)
    var $song = $('<option>');
    $song.attr('value',song.id)
    $song.text(song.artist + " - " + song.title);
    $songList.append($song);
  })
}

var updatePlaylist = function () {
  $('.songs').remove()
  playList.forEach(function(song){
    var $song = $('<option class="songs">');
    $song.attr('value',song.id)
    $song.text(song.artist + " - " + song.title);
    $playlistSelect.append($song);
  })

}


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
    updateUserSongList(0)
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
  })
    .fail(function(err) {
      console.log(err);
  })
 }
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



var updateUserSongList = function (num) {
  console.log("Update " + num)
  if (num === songObjects.length-1){
    saveUserSongs()
    updateSongList();
  }else if (songObjects[num].title !== null){
    updateUserSongList(num+1)
  } else {
    id3(songObjects[num].tempUrl, function(err, tags) {
        songObjects[num].title = tags.title;
        songObjects[num].artist = tags.artist;
        songObjects[num].year = tags.year;
        songObjects[num].album = tags.album;
        updateUserSongList(num+1)
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
    console.log(log)
    populateSongList()
  }).fail(function(){
    console.log("fail")
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
    console.log(data)
    userSongList = data[0].songs
    //sort songs by artist alphabetically
      function compare(a,b) {
        if (a.artist < b.artist)
          return -1;
        if (a.artist > b.artist)
          return 1;
        return 0;
      }
      userSongList = userSongList.sort(compare);


    updateSongList();
  }).fail(function(){
    console.log("fail");
  })

}

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
      }

      });
    }
  });
}


var assignCurrentSong = function(song){
  currentSong = song
}

var playSong = function(){
  soundObject.url = currentSong.tempUrl;
  soundObject.togglePause()
}

var removeSelectedSong = function(){
  var songSelected = $playlistSelect.val()
  var index = null
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

'use strict';

var standalone = window.navigator.standalone,
    userAgent = window.navigator.userAgent.toLowerCase(),
    safari = /safari/.test( userAgent ),
    ios = /iphone|ipod|ipad/.test( userAgent ),
    android = /android/i.test(userAgent),
    rtmpPort = "1935",
    httpPort = "8935",
    hls;

function getUrlVars()
{
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}

function start() {
  var strmID = getUrlVars()["strmID"]
  var broadcasterName = getUrlVars()["broadcasterName"]

  if (broadcasterName != null) {
    $("#broadcaster").text(" - " + broadcasterName + "'s Stream")
  }

  var debug = getUrlVars()["debug"]
  if (debug == "true") {
    $("#msg-div").show()
  } else {
    $("#msg-div").hide()
  }

  if (strmID != null) {
    $("input#stream-id").val(getUrlVars()["strmID"])
    loadNetworkVideo(strmID)
    $("button#start").hide()
    $("input#stream-id").hide()
  }

  $("button#start").click(function() {
    var strmID = $("input#stream-id").val();
    if (strmID == "") {
      console.log("Stream ID cannot be empty")
      return
    }
    // console.log("New stream: " + strmID);

    $("#network-video").removeClass('error')
    $("#network-video").addClass('loading')
    loadNetworkVideo(strmID);
  });
}

function loadNetworkVideo(activeVideo) {
  //See if there is a local node running
  $.get("http://localhost:8935/peersCount")
  .done(function(data) {
    console.log(data);
    console.log("Loading from localhost");
    if (ios || android) {//Don't use hls.js.
      loadNative(activeVideo, true)
    } else {
      loadHlsjs(activeVideo, true)
    }
  }).fail(function() {
    console.log("Loading from cdn");
    if (ios || android) {//Don't use hls.js.
      loadNative(activeVideo, false)
    } else {
      loadHlsjs(activeVideo, false)
    }
  });

  return
}

function loadNative(activeVideo, localnode) {
  console.log("Loading native HLS video")

  var videoURL = "https://d194z9vj66yekd.cloudfront.net/stream/" + activeVideo + '.m3u8';
  if (localnode == true) {
    videoURL = "http://localhost:8935/stream/" + activeVideo + '.m3u8';
  }
  $("#network-video").attr("src", videoURL);
}

function loadHlsjs(activeVideo, localnode) {
  console.log("Loading HLS video with hls.js")
  if (Hls.isSupported()) {
    if (hls) {
      console.log("destroying hls");
      hls.destroy();
      if(hls.bufferTimer) {
        clearInterval(hls.bufferTimer);
        hls.bufferTimer = undefined;
      }
      hls = null;
    }

    var networkVideoElement = document.getElementById('network-video');

    if (!hls) {
      console.log("creating hls");
      hls = new Hls({debug:false, enableWorker : true, manifestLoadingTimeOut: 60000});
    }

    var videoURL = "https://d194z9vj66yekd.cloudfront.net/stream/" + activeVideo + '.m3u8';
    if (localnode == true) {
      videoURL = "http://localhost:8935/stream/" + activeVideo + '.m3u8';
    }
    // var videoURL = "http://localhost:8935/stream/" + activeVideo + '.m3u8';

    console.log("loading video: " + videoURL);
    hls.loadSource(videoURL);
    hls.attachMedia(networkVideoElement);
    $(networkVideoElement).on('loadstart', function(event) {
      $(this).addClass('loading')
    });
    $(networkVideoElement).on('canplay', function (event) {
      $(this).removeClass('loading')
    })
    hls.on(Hls.Events.MEDIA_DETACHED,function() {
      console.log("media detached");
    });
    hls.on(Hls.Events.MEDIA_DETACHED,function() {
      console.log('MediaSource detached...');
    })
    hls.on(Hls.Events.MANIFEST_PARSED,function() {
      console.log("playing video");
      var playPromise = networkVideoElement.play();
      if (playPromise !== undefined) {
        playPromise.then(function() {
          // Automatic playback started!
        }).catch(function(error) {
          // Automatic playback failed.
          // Show a UI element to let the user manually start playback.
        console.log("Error playing video: " + error)
        $(networkVideoElement).removeClass('loading')
        $(networkVideoElement).addClass('error')
        });
      }
    });

    hls.on(Hls.Events.ERROR, function(event,data) {
      console.warn(data);
      $(networkVideoElement).removeClass('loading')

      switch(data.details) {
        case Hls.ErrorDetails.MANIFEST_LOAD_ERROR:
          try {
            $("#HlsStatus").html("cannot Load <a href=\"" + data.context.url + "\">" + videoURL + "</a><br>HTTP response code:" + data.response.code + " <br>" + data.response.text);
              if(data.response.code === 0) {
                $("#HlsStatus").append("this might be a CORS issue, consider installing <a href=\"https://chrome.google.com/webstore/detail/allow-control-allow-origi/nlfbmbojpeacfghkpbjhddihlkkiljbi\">Allow-Control-Allow-Origin</a> Chrome Extension");
              }
          } catch(err) {
            $("#HlsStatus").html("cannot Load <a href=\"" + data.context.url + "\">" + videoURL + "</a><br>Reason:Load " + data.response.text);
          }
          break;
        case Hls.ErrorDetails.MANIFEST_LOAD_TIMEOUT:
          $("#HlsStatus").text("timeout while loading manifest");
          break;
        case Hls.ErrorDetails.MANIFEST_PARSING_ERROR:
          $("#HlsStatus").text("error while parsing manifest:" + data.reason);
          break;
        case Hls.ErrorDetails.LEVEL_LOAD_ERROR:
          $("#HlsStatus").text("error while loading level playlist");
          break;
        case Hls.ErrorDetails.LEVEL_LOAD_TIMEOUT:
          $("#HlsStatus").text("timeout while loading level playlist");
          break;
        case Hls.ErrorDetails.LEVEL_SWITCH_ERROR:
          $("#HlsStatus").text("error while trying to switch to level " + data.level);
          break;
        case Hls.ErrorDetails.FRAG_LOAD_ERROR:
          $("#HlsStatus").text("error while loading fragment " + data.frag.url);
          break;
        case Hls.ErrorDetails.FRAG_LOAD_TIMEOUT:
          $("#HlsStatus").text("timeout while loading fragment " + data.frag.url);
          break;
        case Hls.ErrorDetails.FRAG_LOOP_LOADING_ERROR:
          $("#HlsStatus").text("Frag Loop Loading Error");
          break;
        case Hls.ErrorDetails.FRAG_DECRYPT_ERROR:
          $("#HlsStatus").text("Decrypting Error:" + data.reason);
          break;
        case Hls.ErrorDetails.FRAG_PARSING_ERROR:
          $("#HlsStatus").text("Parsing Error:" + data.reason);
          break;
        case Hls.ErrorDetails.KEY_LOAD_ERROR:
          $("#HlsStatus").text("error while loading key " + data.frag.decryptdata.uri);
          break;
        case Hls.ErrorDetails.KEY_LOAD_TIMEOUT:
          $("#HlsStatus").text("timeout while loading key " + data.frag.decryptdata.uri);
          break;
        case Hls.ErrorDetails.BUFFER_APPEND_ERROR:
          $("#HlsStatus").text("Buffer Append Error");
          break;
        case Hls.ErrorDetails.BUFFER_ADD_CODEC_ERROR:
          $("#HlsStatus").text("Buffer Add Codec Error for " + data.mimeType + ":" + data.err.message);
          break;
        case Hls.ErrorDetails.BUFFER_APPENDING_ERROR:
          $("#HlsStatus").text("Buffer Appending Error");
          break;
        default:
          break;
      }
      if(data.fatal) {
        console.log('fatal error :' + data.details);

        networkVideoElement.pause()
        networkVideoElement.src = ""
        networkVideoElement.load()
        $(networkVideoElement).addClass('error')

        switch(data.type) {
          case Hls.ErrorTypes.MEDIA_ERROR:
            handleMediaError();
            break;
          case Hls.ErrorTypes.NETWORK_ERROR:
            $("#HlsStatus").append(",network error ...");
            break;
          default:
            $("#HlsStatus").append(", unrecoverable error");
            hls.destroy();
            break;
        }
        console.log($("#HlsStatus").text());
      }
      var stats = {}
      // if(!stats) stats = {};
      // track all errors independently
      if (stats[data.details] === undefined) {
        stats[data.details] = 1;
      } else {
        stats[data.details] += 1;
      }
      // track fatal error
      if (data.fatal) {
        if (stats.fatalError === undefined) {
          stats.fatalError = 1;
        } else {
            stats.fatalError += 1;
        }
      }
      $("#HlsStats").text(JSON.stringify(sortObject(stats),null,"\t"));
    });

  } else {
    console.log("HLS.js is not supported.")
  }
}

function sortObject(obj) {
  if(typeof obj !== 'object')
      return obj
  var temp = {};
  var keys = [];
  for(var key in obj)
      keys.push(key);
  keys.sort();
  for(var index in keys)
      temp[keys[index]] = sortObject(obj[keys[index]]);
  return temp;
}

start();
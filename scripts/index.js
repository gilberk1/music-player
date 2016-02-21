  var requestAnimFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

  var sound = document.getElementById('sound'),
    audioCtx = new AudioContext(),
    source = audioCtx.createMediaElementSource(sound),
    analyser = audioCtx.createAnalyser(),
    frequencyData = new Uint8Array(analyser.frequencyBinCount);

  var visualizer = document.getElementById('visualizer'),
    canvas = document.querySelector('#visualizer > canvas'),
    ctx = canvas.getContext('2d'),
    canvasWidth = canvas.width,
    canvasHeight = canvas.height;

  var freqs = [60, 90, 130, 225, 320, 453, 640, 900, 1300, 1800, 2500, 3000, 4500, 6000, 8000, 10000, 12000, 14000, 15000, 16000];

  sound.crossOrigin = "anonymous";

  function start() {
    analyser.getByteFrequencyData(frequencyData);
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    for (var i = 0; i < freqs.length; i++) {
      ctx.beginPath();
      ctx.moveTo(i * (canvasWidth * 8) / 100, 300);
      ctx.lineTo(i * (canvasWidth * 8) / 100, 300 - freq(freqs[i]));
      ctx.lineWidth = (canvasWidth * 8) / 100;
      ctx.strokeStyle = "#fff";
      ctx.stroke();
    }

    requestAnimFrame(start);
  }

  function freq(frequency) {
    var nyquistFreq = audioCtx.sampleRate / 2;
    var visualFreq = Math.round(frequency / nyquistFreq * frequencyData.length);

    return frequencyData[visualFreq] - 75;
  }

// Code from lines 46 - 70 I copied from the work Johan Karlsson
// http://codepen.io/DonKarlssonSan/pen/vOXLMr

  function url(url, callback) {
    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
      if (request.readyState == 4 && request.status == 200) {
        callback(request.responseText);
      }
    }

    request.open("GET", url, true);
    request.send(null);
  }

  var clientParameter = "client_id=e1f3481c95793a8d59ed18a5ea451af3"

  var trackPermalinkUrl =
    "https://soundcloud.com/aviciiofficial/avicii-levels-skrillex-remix";

  function setSrc() {
    url("http://api.soundcloud.com/resolve.json?url=" + trackPermalinkUrl + "&" + clientParameter,
      function(response) {
        var trackInfo = JSON.parse(response);
        sound.src = trackInfo.stream_url + "?" + clientParameter;
      }
    );
  };

  source.connect(analyser);
  analyser.connect(audioCtx.destination);
  setSrc();
  start();
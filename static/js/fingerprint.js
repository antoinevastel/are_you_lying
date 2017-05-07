function generateFingerprint(){
    var fp = {}
    return new Promise(function(resolve, reject){
      fp.userAgent = getUserAgent();
      fp.language = getLanguage();
      fp.colorDepth = getColorDepth();
      fp.pixelRatio = getPixelRatio();
      fp.hardwareConcurrency = getHardwareConcurrency();
      fp.screenResolution = getScreenResolution();
      fp.availableScreenResolution = getAvailableScreenResolution();
      fp.timezone = getTimezone();
      fp.sessionStorage = getSessionStorage();
      fp.indexedDb = getIndexedDb();
      fp.cpuClass = getNavigatorCpuClass();
      fp.platform = getNavigatorPlatform();
      fp.doNotTrack = getDoNotTrack();
      fp.plugins = getPlugins();
      var canvasObj = getCanvasFp();
      fp.canvas = canvasObj.url;
      fp.adBlock = getAdBlock();
      getWebGL();
      fp.modernizr = testModernizr();
      fp.overwrittenObjects = testOverwrittenObjects();
      fp.canvasPixels = testCanvasValue(canvasObj.data);

      // New attributes
      fp.appCodeName = getAppCodeName();
      fp.oscpu = getOscpu();
      fp.appName = getAppName();
      fp.appVersion = getAppVersion();
      fp.languages = getLanguages();
      fp.mimeTypes = getMimeTypes();
      fp.pluginsUsingMimeTypes = getPluginsUsingMimeTypes();
      fp.product = getProduct();
      fp.productSub = getProductSub();
      fp.vendor = getVendor();
      fp.vendorSub = getVendorSub();
      fp.touchSupport = getTouchSupport();
      fp.buildID = getBuildId();
      fp.navigatorPrototype = getNavigatorPrototype();
      fp.mathsConstants = getMathsConstants();

      // TODO add more errors ?
      // Delete the number of the line and column in the error since it might change
      // when we add/remove features to this script
      var resOverflow = generateStackOverflow();
      fp.stackOverflowDepth = resOverflow.depth;
      fp.stackOverflowError = resOverflow.error;
      fp.webSocketError = generateWebSocketError();
      fp.errorsGenerated = generateErrors();

      fp.languagesFonts = getLanguagesUsingFonts();
      // TODO: test more, problem might happen when promise not hold !
      var p1 = new Promise(function(resolve, reject){
        getLocalIP().then(function(val){
          fp.localIP = val;
          return resolve(fp);
        });
      });

      // ISP + bandwidth test ? http://webkay.robinlinus.com/
      // http://webkay.robinlinus.com/scripts/speedtest.js
      // Depends on external APIs :/
      // Try a network scan ?
      // http://webkay.robinlinus.com/scripts/network-scanner.js
      // add social media leakage
      // http://webkay.robinlinus.com/scripts/social-media.js
      // add http headers (json request ?, use promises !)
      var p2 = new Promise(function(resolve, reject){
          getHTTPHeaders("http://127.0.0.1:5000/headers").then(function(val){
            fp.httpHeaders = val;
            return resolve(fp);
        });
      });

      // Add single emoji to detect os ?
      var p3 = new Promise(function(resolve, reject){
          getAudio().then(function(val){
            fp.audio = val.data;
            return resolve(fp);
          });
      });

      var p4 = new Promise(function(resolve, reject){
          generateUnknownImageError().then(function(val){
              fp.unknownImageError = val;
              return resolve(fp);
          });
      });

      // TODO: add p1 later
      // Problem currently if no private address
      return Promise.all([p2, p3, p4]).then(function () {
          return resolve(fp);
      });

  });
	// this.generateNoNewKeywordError();
	// Look at https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Promise/all
}

function getNavigatorPrototype(){
	var obj = window.navigator;
	var protoNavigator = [];
	do Object.getOwnPropertyNames(obj).forEach(function(name) {
		protoNavigator.push(name);
	});
	while(obj = Object.getPrototypeOf(obj));

  var res;
  var finalProto = [];
  protoNavigator.forEach(function(prop){
    var objDesc = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(navigator), prop);
    if(objDesc != undefined){
      if(objDesc.value != undefined){
          res = objDesc.value.toString();
      }else if(objDesc.get != undefined){
          res = objDesc.get.toString();
      }
    }else{
        res = "";
    }
    finalProto.push({property: prop, val: res});

  });
	return finalProto;
}

function getBuildId(){
	if(navigator.buildID){
		return navigator.buildID;
	}
	return "unknown";
}

function getVendor(){
	return navigator.vendor;
}

function getVendorSub(){
	return navigator.vendorSub;
}

function getTouchSupport(){
		var maxTouchPoints = 0;
		var touchEvent = false;
		if(typeof navigator.maxTouchPoints !== "undefined") {
			maxTouchPoints = navigator.maxTouchPoints;
		} else if (typeof navigator.msMaxTouchPoints !== "undefined") {
			maxTouchPoints = navigator.msMaxTouchPoints;
		}
		try {
			document.createEvent("TouchEvent");
			touchEvent = true;
		} catch(_) { /* squelch */ }
		var touchStart = "ontouchstart" in window;
		return [maxTouchPoints, touchEvent, touchStart];
	}
	
function getProduct(){
	return navigator.product;	
}

function getProductSub(){
	return navigator.productSub;
}

function getAppCodeName(){
	return navigator.appCodeName;
}

function getAppName(){
	return navigator.appName;
}

function getAppVersion(){
	return navigator.appVersion;
}

function getLanguages(){
	if(navigator.languages){
		return navigator.languages;
	}
	return "unknown";
}

// TODO fix this so that we can't try to match it with plugins
function getMimeTypes(){
	var mimeTypes = [];
	for(var i = 0; i < navigator.mimeTypes.length; i++){
		var mt = navigator.mimeTypes[i];
		mimeTypes.push([mt.description, mt.type, mt.suffixes].join("~"));
	}
	return mimeTypes;
}

function getPluginsUsingMimeTypes(){
	var plugins = [];
	for(var i = 0; i < navigator.mimeTypes.length; i++){
		var mt = navigator.mimeTypes[i];
		plugins.push([mt.enabledPlugin.name, mt.enabledPlugin.description, mt.enabledPlugin.filename].join("::")+mt.type);
	}
	return plugins;
}


function generateStackOverflow(){
	var depth = 0;
  var errorMessage;
  var errorName;
	function inc(){
		try{
			depth++;
			inc();
		}catch(e){
      errorMessage = e.message;
      errorName = e.name;
		}
	}

	inc();
	return {depth: depth, error: {name: errorName, message: errorMessage}};
}


function generateWebSocketError(){
	var error = "";
	try{
		var a = new WebSocket("itsgonnafail");
	}catch(e){
		error += e.toString();
	}
	return error;
}

function getOscpu(){
	if(navigator.oscpu){
		return navigator.oscpu;
	}
	return "unkwown";
}

function getUserAgent(){
	return navigator.userAgent;	
}

function getLanguage(){
	return navigator.language || navigator.userLanguage || navigator.browserLanguage || navigator.systemLanguage || "";		
}

function getColorDepth(){
	return screen.colorDepth || -1;
}

function getPixelRatio(){
	return window.devicePixelRatio || ""; 
}

function getScreenResolution(){
	return [screen.width, screen.height];
}

function getAvailableScreenResolution(){
	if(screen.availWidth && screen.availHeight) {
		return [screen.availWidth, screen.availHeight];
	}
	return -1;
}

function getTimezone(){
	return new Date().getTimezoneOffset();
}

function getSessionStorage(){
	try {
			return !!window.sessionStorage;
		} catch(e) {
			return true; // SecurityError when referencing it means it exists
		}
}

function getIndexedDb(){
	try {
			return !!window.indexedDB;
		} catch(e) {
			return true; // SecurityError when referencing it means it exists
		}
}

function getHardwareConcurrency(){
	if(navigator.hardwareConcurrency){
		return navigator.hardwareConcurrency;
	}
	return "unknown";
}

function getNavigatorCpuClass(){
	if(navigator.cpuClass){
		return navigator.cpuClass;
	}
	return "unknown";
}

function getNavigatorPlatform(){
	if(navigator.platform) {
		return navigator.platform;
	}
	return "unknown";
}

function getDoNotTrack() {
	if(navigator.doNotTrack) {
		return navigator.doNotTrack;
	} else if (navigator.msDoNotTrack) {
		return navigator.msDoNotTrack;
	} else if (window.doNotTrack) {
		return window.doNotTrack;
	}
	return "unknown";
}

function getWebGL(){
  canvas = document.createElement('canvas');
  var ctx = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
  if(ctx.getSupportedExtensions().indexOf("WEBGL_debug_renderer_info") >= 0) {
      webGLVendor = ctx.getParameter(ctx.getExtension('WEBGL_debug_renderer_info').UNMASKED_VENDOR_WEBGL);
      webGLRenderer = ctx.getParameter(ctx.getExtension('WEBGL_debug_renderer_info').UNMASKED_RENDERER_WEBGL);
  } else {
      webGLVendor = "Not supported";
      webGLRenderer = "Not supported";
  }
  console.log(webGLVendor);
  console.log(webGLRenderer);
}

function getCanvasFp() {
  canvas = document.createElement("canvas");
  canvas.height = 60;
  canvas.width = 400;
  canvasContext = canvas.getContext("2d");
  canvas.style.display = "inline";
  canvasContext.textBaseline = "alphabetic";
  canvasContext.fillStyle = "#f60";
  canvasContext.fillRect(125, 1, 62, 20);
  canvasContext.fillStyle = "#069";
  canvasContext.font = "11pt no-real-font-123";
  canvasContext.fillText("Cwm fjordbank glyphs vext quiz, \ud83d\ude03", 2, 15);
  canvasContext.fillStyle = "rgba(102, 204, 0, 0.7)";
  canvasContext.font = "18pt Arial";
  canvasContext.fillText("Cwm fjordbank glyphs vext quiz, \ud83d\ude03", 4, 45);
  canvasData = canvas.toDataURL();

  return {url: canvasData, data:canvasContext.getImageData(0, 0, canvas.width, canvas.height).data};
}

function getAdBlock(){
	var ads = document.createElement("div");
	ads.innerHTML = "&nbsp;";
	ads.className = "adsbox";
	var result = false;
	try {
		// body may not exist, that's why we need try/catch
		document.body.appendChild(ads);
		result = document.getElementsByClassName("adsbox")[0].offsetHeight === 0;
		document.body.removeChild(ads);
	} catch (e) {
		result = false;
	}
	return result;
}

// Works only for non ie browsers
// Therefore, if it works on an IE browser, it means that its a fake IE
function getPlugins(){
	var plugins = [];
	for(var i = 0, l = navigator.plugins.length; i < l; i++) {
		plugins.push(navigator.plugins[i]);
	}
	return this.map(plugins, function (p) {
		var mimeTypes = this.map(p, function(mt){
			return [mt.type, mt.suffixes].join("~");
		}).join(",");
		return [p.name, p.description, p.filename, mimeTypes].join("::");
	}, this);
}

function generateUnknownImageError(){
	var body = document.getElementsByTagName("body")[0];
	var image = document.createElement("img");
	image.src = "http://iloveponeydotcom32188.jg";
	image.setAttribute("id", "fakeimage");
	body.appendChild(image);
	image = document.getElementById("fakeimage");
	return new Promise(function(resolve, reject){
		 setTimeout(function(){
				resolve([image.width, image.height]);
		}, 200);
	});
}

  // We generate an error
  // It might bring more information than simply looking
  // at the error prototype
 function generateNoNewKeywordError(){
   // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error
   // If we wanted to detect if someone is overriding the constructor,
   // we could try to generate random code in an eval block
   // and we detect if that is the good lines ?
   var error_fp = {};
   try{
    sddfk + djfsdf;
   }catch(e){
    console.log(e.message);
    console.log(e.fileName); // FF only
    console.log(e.description); // IE only
    console.log(e.toSource()); // doesn't seem to work on chrome
   }
   console.log("thsdjfsdfk")
 }

function getIPs(callback){
	var ip_dups = {};
	//compatibility for firefox and chrome
	var RTCPeerConnection = window.RTCPeerConnection
			|| window.mozRTCPeerConnection
			|| window.webkitRTCPeerConnection;
	var useWebKit = !!window.webkitRTCPeerConnection;
	//minimal requirements for data connection
	var mediaConstraints = {
			optional: [{RtpDataChannels: true}]
	};
	var servers = {iceServers: [{urls: "stun:stun.services.mozilla.com"}]};
	//construct a new RTCPeerConnection
	var pc = new RTCPeerConnection(servers, mediaConstraints);
	function handleCandidate(candidate){
			//match just the IP address
			var ip_regex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/
			var ip_addr = ip_regex.exec(candidate)[1];
			//remove duplicates
			if(ip_dups[ip_addr] === undefined)
					callback(ip_addr);
			ip_dups[ip_addr] = true;
	}
	//listen for candidate events
	pc.onicecandidate = function(ice){
			//skip non-candidate events
			if(ice.candidate)
					handleCandidate(ice.candidate.candidate);
	};
	//create a bogus data channel
	pc.createDataChannel("");
	//create an offer sdp
	pc.createOffer(function(result){
			//trigger the stun server request
			pc.setLocalDescription(result, function(){}, function(){});
	}, function(){});
	//wait for a while to let everything done
	setTimeout(function(){
			//read candidate info from local description
			var lines = pc.localDescription.sdp.split('\n');
      // console.log(lines);
			lines.forEach(function(line){
					if(line.indexOf('a=candidate:') === 0)
							handleCandidate(line);
			});
	}, 1000);
}

function getLocalIP(){
	return new Promise(function(resolve, reject){
		getIPs(function(ip){
			//local IPs
			if (ip.match(/^(192\.168\.|169\.254\.|10\.|172\.(1[6-9]|2\d|3[01]))/)){
					return resolve(ip);
			}
		});
	});
}

// Maths constants
// code taken from fp-central
function getMathsConstants(){
    function asinh(x) {
        if (x === -Infinity) {
            return x;
        } else {
            return Math.log(x + Math.sqrt(x * x + 1));
        }
    }

    function acosh(x) {
        return Math.log(x + Math.sqrt(x * x - 1));
    }

    function atanh(x) {
        return Math.log((1 + x) / (1 - x)) / 2;
    }

    function cbrt(x) {
        var y = Math.pow(Math.abs(x), 1 / 3);
        return x < 0 ? -y : y;
    }

    function cosh(x) {
        var y = Math.exp(x);
        return (y + 1 / y) / 2;
    }

    function expm1(x) {
        return Math.exp(x) - 1;
    }

    function log1p(x) {
        return Math.log(1 + x);
    }

    function sinh(x) {
        var y = Math.exp(x);
        return (y - 1 / y) / 2;
    }

    function tanh(x) {
        if (x === Infinity) {
            return 1;
        } else if (x === -Infinity) {
            return -1;
        } else {
            var y = Math.exp(2 * x);
            return (y - 1) / (y + 1);
        }
    }

		return {
				"asinh(1)": asinh(1),
				"acosh(1e300)": (acosh(1e300) == "Infinity") ? "Infinity" : acosh(1e300),
				"atanh(05)": atanh(0.5),
				"expm1(1)": expm1(1),
				"cbrt(100)": cbrt(100),
				"log1p(10)": log1p(10),
				"sinh(1)": sinh(1),
				"cosh(10)": cosh(10),
				"tanh(1)": tanh(1)
		}
}

// Audio fingerprinting
// Code taken from fp-central
function getAudio() {
    var audioData = {};

	// Performs fingerprint as found in https://client.a.pxi.pub/PXmssU3ZQ0/main.min.js
	//Sum of buffer values
    var p1 = new Promise(function (resolve, reject) {
        try {
            if (context = new (window.OfflineAudioContext || window.webkitOfflineAudioContext)(1, 44100, 44100), !context) {
                audioData.pxi_output = 0;
            }

            // Create oscillator
            pxi_oscillator = context.createOscillator();
            pxi_oscillator.type = "triangle";
            pxi_oscillator.frequency.value = 1e4;

            // Create and configure compressor
            pxi_compressor = context.createDynamicsCompressor();
            pxi_compressor.threshold && (pxi_compressor.threshold.value = -50);
            pxi_compressor.knee && (pxi_compressor.knee.value = 40);
            pxi_compressor.ratio && (pxi_compressor.ratio.value = 12);
            pxi_compressor.reduction && (pxi_compressor.reduction.value = -20);
            pxi_compressor.attack && (pxi_compressor.attack.value = 0);
            pxi_compressor.release && (pxi_compressor.release.value = .25);

            // Connect nodes
            pxi_oscillator.connect(pxi_compressor);
            pxi_compressor.connect(context.destination);

            // Start audio processing
            pxi_oscillator.start(0);
            context.startRendering();
            context.oncomplete = function (evnt) {
                try {
                    audioData.pxi_output = 0;
                    var sha1 = CryptoJS.algo.SHA1.create();
                    for (var i = 0; i < evnt.renderedBuffer.length; i++) {
                        sha1.update(evnt.renderedBuffer.getChannelData(0)[i].toString());
                    }
                    hash = sha1.finalize();
                    audioData.pxi_full_buffer_hash = hash.toString(CryptoJS.enc.Hex);
                    for (var i = 4500; 5e3 > i; i++) {
                        audioData.pxi_output += Math.abs(evnt.renderedBuffer.getChannelData(0)[i]);
                    }
                    pxi_compressor.disconnect();
                    resolve();
                } catch(u){
                    audioData.pxi_output = 0;
                    resolve();
                }
            }
        } catch (u) {
            audioData.pxi_output = 0;
            resolve();
        }
    });

// End PXI fingerprint

// Performs fingerprint as found in some versions of http://metrics.nt.vc/metrics.js
    function a(a, b, c) {
        for (var d in b) "dopplerFactor" === d || "speedOfSound" === d || "currentTime" ===
        d || "number" !== typeof b[d] && "string" !== typeof b[d] || (a[(c ? c : "") + d] = b[d]);
        return a
    }

    var p2 = new Promise(function (resolve, reject) {
        try {
            var nt_vc_context = window.AudioContext || window.webkitAudioContext;
            if ("function" !== typeof nt_vc_context) audioData.nt_vc_output = "Not available";
            else {
                var f = new nt_vc_context,
                    d = f.createAnalyser();
                audioData.nt_vc_output = a({}, f, "ac-");
                audioData.nt_vc_output = a(audioData.nt_vc_output, f.destination, "ac-");
                audioData.nt_vc_output = a(audioData.nt_vc_output, f.listener, "ac-");
                audioData.nt_vc_output = a(audioData.nt_vc_output, d, "an-");
            }
        } catch (g) {
            audioData.nt_vc_output = 0
        }
        resolve();
    });

// Performs fingerprint as found in https://www.cdn-net.com/cc.js
    var cc_output = [];

    var p3 = new Promise(function (resolve, reject) {
        var audioCtx = new (window.AudioContext || window.webkitAudioContext),
            oscillator = audioCtx.createOscillator(),
            analyser = audioCtx.createAnalyser(),
            gain = audioCtx.createGain(),
            scriptProcessor = audioCtx.createScriptProcessor(4096, 1, 1);


        gain.gain.value = 0; // Disable volume
        oscillator.type = "triangle"; // Set oscillator to output triangle wave
        oscillator.connect(analyser); // Connect oscillator output to analyser input
        analyser.connect(scriptProcessor); // Connect analyser output to scriptProcessor input
        scriptProcessor.connect(gain); // Connect scriptProcessor output to gain input
        gain.connect(audioCtx.destination); // Connect gain output to audiocontext destination

        scriptProcessor.onaudioprocess = function (bins) {
            bins = new Float32Array(analyser.frequencyBinCount);
            analyser.getFloatFrequencyData(bins);
            for (var i = 0; i < bins.length; i = i + 1) {
                cc_output.push(bins[i]);
            }
            analyser.disconnect();
            scriptProcessor.disconnect();
            gain.disconnect();
            audioData.cc_output = cc_output.slice(0, 30);
            resolve();
        };

        oscillator.start(0);
    });

// Performs a hybrid of cc/pxi methods found above
    var hybrid_output = [];

    var p4 = new Promise(function (resolve, reject) {
        var audioCtx = new (window.AudioContext || window.webkitAudioContext),
            oscillator = audioCtx.createOscillator(),
            analyser = audioCtx.createAnalyser(),
            gain = audioCtx.createGain(),
            scriptProcessor = audioCtx.createScriptProcessor(4096, 1, 1);

        // Create and configure compressor
        compressor = audioCtx.createDynamicsCompressor();
        compressor.threshold && (compressor.threshold.value = -50);
        compressor.knee && (compressor.knee.value = 40);
        compressor.ratio && (compressor.ratio.value = 12);
        compressor.reduction && (compressor.reduction.value = -20);
        compressor.attack && (compressor.attack.value = 0);
        compressor.release && (compressor.release.value = .25);

        gain.gain.value = 0; // Disable volume
        oscillator.type = "triangle"; // Set oscillator to output triangle wave
        oscillator.connect(compressor); // Connect oscillator output to dynamic compressor
        compressor.connect(analyser); // Connect compressor to analyser
        analyser.connect(scriptProcessor); // Connect analyser output to scriptProcessor input
        scriptProcessor.connect(gain); // Connect scriptProcessor output to gain input
        gain.connect(audioCtx.destination); // Connect gain output to audiocontext destination

        scriptProcessor.onaudioprocess = function (bins) {
            bins = new Float32Array(analyser.frequencyBinCount);
            analyser.getFloatFrequencyData(bins);
            for (var i = 0; i < bins.length; i = i + 1) {
                hybrid_output.push(bins[i]);
            }
            analyser.disconnect();
            scriptProcessor.disconnect();
            gain.disconnect();

            audioData.hybrid_output = hybrid_output.slice(0, 30);
            resolve();
        };

        oscillator.start(0);
    });

		return Promise.all([p1, p2, p3, p4]).then(function () {
				return {name: "audio", data: audioData};
		});
}


function get(url) {
  // Return a new promise.
  return new Promise(function(resolve, reject) {
    // Do the usual XHR stuff
    var req = new XMLHttpRequest();
    req.open('GET', url);

    req.onload = function() {
      // This is called even on 404 etc
      // so check the status
      if (req.status == 200) {
        // Resolve the promise with the response text
        resolve(req.response);
      }
      else {
        // Otherwise reject with the status text
        // which will hopefully be a meaningful error
        reject(Error(req.statusText));
      }
    };

    // Handle network errors
    req.onerror = function() {
      reject(Error("Network Error"));
    };

    // Make the request
    req.send();
  });
}

function getHTTPHeaders(url){
  return new Promise(function(resolve, reject){
    get(url).then(function(response) {
        httpHeaders = JSON.parse(response);
        resolve(httpHeaders)
      }, function(error) {
        reject(error);
      })
  });
}

function testModernizr(){
  var propertiesVec = [];
  var modernizrProperties = Object.getOwnPropertyNames(Modernizr);
  modernizrProperties.forEach(function(prop){
    propertiesVec.push({property: prop, available: Modernizr[prop]});
  });
  return propertiesVec;
}

function testCanvasValue(imgData){
  var r, g, b, a;

  var height = 60;
  var width = 400;
  var binarizedImg = new Array(height + 2);
  for(var i = 0; i < binarizedImg.length; i++){
    binarizedImg[i] = new Array(width + 2);
  }

  for(var j = 0; j < binarizedImg[0].length; j++){
    binarizedImg[0][j] = false;
    binarizedImg[binarizedImg.length - 1][j] = false;
  }

  for(var i = 0; i < binarizedImg.length; i++){
    binarizedImg[i][0] = false;
    binarizedImg[i][binarizedImg[0].length - 1] = false;
  }
  console.log("test1");
  var binValue;
  nbZeroElts = 0;
  var xi = 1, yi = 1;
  for(var i = 0; i < imgData.length; i = i+4){
    r = imgData[i];
    g = imgData[i+1];
    b = imgData[i+2];
    a = imgData[i+3];
    if(r ==0 && g ==0 && b ==0 && a == 0){
        binValue = false;
        nbZeroElts++;
    } else{
        binValue = true;
    }
    if((yi)% width == 0){
        yi = 1;
        xi++;
    }else{
        yi++;
    }
    //probably a problem with offsets, check it later...
    binarizedImg[xi][yi] = binValue;
  }

  var isolatedCells = [];
  for(var i = 1; i < binarizedImg.length-1; i++){
    for(var j = 1; j < binarizedImg[0].length-1; j++){
      var isolated = true;
      if(binarizedImg[i][j] == true){
        if(!binarizedImg[i-1][j-1] && !binarizedImg[i-1][j] && !binarizedImg[i-1][j+1] &&
        !binarizedImg[i][j-1] && !binarizedImg[i][j+1] && !binarizedImg[i+1][j-1] && !binarizedImg[i+1][j] &&
        !binarizedImg[i+1][j+1]){
            //all cells are empty next to i,j
            isolatedCells.push({x:i-1, y:j-1});
        }
      }
    }
  }

  return {nbZeros: nbZeroElts, isolatedCells: isolatedCells};
}

function testOverwrittenObjects(){
    var screenTest;
    try{
        screenTest = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(screen), "width").get.toString();
    } catch(e){
        screenTest = "error";
    }
    var oscpuTest;
    try{
        oscpuTest = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(navigator), "oscpu").get.toString();
        // Should fail if Chrome
    } catch(e){
        oscpuTest = "error";
    }
    var canvasTest;
    try{
        canvasTest = Object.getOwnPropertyDescriptor(window.HTMLCanvasElement.prototype, "toDataURL").value.toString();
    } catch(e){
        // Error may also occur if canvas is simply unavailable
        canvasTest = "error";
    }

    var vendorTest;
    try{
        vendorTest = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(navigator), "vendor").get.toString();
    } catch(e) {
        vendorTest = "error";
    }

    var dateTest;
    try{
        dateTest = Object.getOwnPropertyDescriptor(Date.prototype, "getTimezoneOffset").value.toString();
    } catch(e) {
        dateTest = "error";
    }

    return {screenTest: screenTest, oscpuTest: oscpuTest, canvasTest: canvasTest, vendorTest: vendorTest, dateTest: dateTest};
}


function map(obj, iterator, context) {
	var results = [];
	// Not using strict equality so that this acts as a
	// shortcut to checking for `null` and `undefined`.
	if (obj == null) { return results; }
	if (this.nativeMap && obj.map === this.nativeMap) { return obj.map(iterator, context); }
	this.each(obj, function(value, index, list) {
		results[results.length] = iterator.call(context, value, index, list);
	});
	return results;
}

function each(obj, iterator, context) {
	if (obj === null) {
		return;
	}
	if (this.nativeForEach && obj.forEach === this.nativeForEach) {
		obj.forEach(iterator, context);
	} else if (obj.length === +obj.length) {
		for (var i = 0, l = obj.length; i < l; i++) {
			if (iterator.call(context, obj[i], i, obj) === {}) { return; }
		}
	} else {
		for (var key in obj) {
			if (obj.hasOwnProperty(key)) {
				if (iterator.call(context, obj[key], key, obj) === {}) { return; }
			}
		}
	}
}


function isPlatformOSrefConsistent(platform, osRef){
    console.log("Test consistency of: "+platform+" and "+osRef);
    var platformFamily;
    if(platform.indexOf("Linux") > -1){
        platformFamily = "Linux";
    } else if(platform.indexOf("Windows") > -1){
        platformFamily = "Windows";
    } else if(platform.indexOf("Mac") > -1){
        platformFamily = "Mac OS";
    }

    var platformFamilyToConsistentOs = {};
    platformFamilyToConsistentOs["Linux"] = ["Linux", "Ubuntu"];
    platformFamilyToConsistentOs["Windows"] = ["Windows"];
    platformFamilyToConsistentOs["Mac OS"] = ["Mac OS"];
    if(platformFamilyToConsistentOs[platformFamily].indexOf(osRef) > -1){
        console.log("Platform and osRef are consistent");
    } else{
        console.log("Platform and osRef are not consistent");
    }
}

function isPluginsOSrefConsistent(osRef, plugins){
    console.log(plugins);
    // also add windows phone
    if((osRef == "Android" || osRef == "iOS") && plugins.length > 0){
        console.log("Error: Mobile phone with plugins detected");
    }

    var forbiddenExtensions;
    if(osRef == "Linux" || osRef == "Ubuntu"){
        forbiddenExtensions = [".dll", ".plugin"];
    } else if(osRef == "Mac OS"){
        forbiddenExtensions = [".dll", ".so"];
    } else if(osRef == "Windows"){
        forbiddenExtensions = [".so", ".plugin"];
    }

    var found = false;
    if(plugins.indexOf(forbiddenExtensions[0]) > -1){
        found = true;
    }
    if(!found && plugins.indexOf(forbiddenExtensions[1]) > -1){
        found = true;
    }
    if(found){
        console.log("Error: plugins filename extension inconstent with osRef");
    } else{
        console.log("Plugins filename extension is consistent with osRef");
    }
}

function checkOSMq(osRef, versionRef){
    var queryMatchedColor = "red";
    if(versionRef == undefined){
        versionRef = " ";
    }
    var testMac1 = document.getElementById("testmac1");
    var testWinXP = document.getElementById("testwinxp");
    var testWinVis = document.getElementById("testwinvis");
    var testWin7 = document.getElementById("testwin7");
    var testWin8 = document.getElementById("testwin8");
    testsFailed = [];

    if(testMac1.style.color == queryMatchedColor && osRef != "Mac OS"){
      testsFailed.push("testMac1");
    }

    if((testWinXP.style.color == queryMatchedColor && osRef+" "+versionRef != "Windows XP") ||
        (testWinXP.style.color != queryMatchedColor && osRef+" "+versionRef == "Windows XP")){
        testsFailed.push("testWinXp");
    }

    if((testWinVis.style.color == queryMatchedColor && osRef+" "+versionRef != "Windows Vista") ||
        (testWinVis.style.color != queryMatchedColor && osRef+" "+versionRef == "Windows Vista")){
        testsFailed.push("testWinVis");
    }

    if((testWin7.style.color == queryMatchedColor && osRef+" "+versionRef[0] != "Windows 7") ||
        (testWin7.style.color != queryMatchedColor && osRef+" "+versionRef[0] == "Windows 7")){
        testsFailed.push("testWin7");
    }

    if((testWin8.style.color == queryMatchedColor && osRef+" "+versionRef[0] != "Windows 8") ||
        (testWin8.style.color != queryMatchedColor && osRef+" "+versionRef[0] == "Windows 8")){
        testsFailed.push("testWin8");
    }

    console.log("tests failed");
    console.log(testsFailed);
}

function generateErrors(){
    var errors = {};
    try{
        azeaze+3;
    }catch(e){
        errors["errorMessage"] = e.message;
        errors["filename"] = e.fileName;
        errors["lineNumber"] = e.lineNumber;
        errors["errorDescription"] = e.description;
        errors["errorNumber"] = e.number;
        errors["columnNumber"] = e.columnNumber;
        try{
            errors["columnNumber"] = e.toSource().toString();
        }catch(e){
            errors["columnNumber"] = undefined;
        }
      }
    console.log(errors);
    return errors;
}

function isMissingImageConsistent(unknownImageError, browserRef){
    // Image size depends on the level of zoom...
    var screenCssPixelRatio = (window.outerWidth - 8) / window.innerWidth;
    if (screenCssPixelRatio >= .46 && screenCssPixelRatio <= .54) {
      zoomLevel = "-4";
    } else if (screenCssPixelRatio <= .64) {
      zoomLevel = "-3";
    } else if (screenCssPixelRatio <= .76) {
      zoomLevel = "-2";
    } else if (screenCssPixelRatio <= .92) {
      zoomLevel = "-1";
    } else if (screenCssPixelRatio <= 1.10) {
      zoomLevel = "0";
    } else if (screenCssPixelRatio <= 1.32) {
      zoomLevel = "1";
    } else if (screenCssPixelRatio <= 1.58) {
      zoomLevel = "2";
    } else if (screenCssPixelRatio <= 1.90) {
      zoomLevel = "3";
    } else if (screenCssPixelRatio <= 2.28) {
      zoomLevel = "4";
    } else if (screenCssPixelRatio <= 2.70) {
      zoomLevel = "5";
    } else {
      zoomLevel = "unknown";
    }
    console.log("Zoom level: "+zoomLevel);
  console.log(unknownImageError[0], unknownImageError[1]);
  console.log(unknownImageError[0]*unknownImageError[1]/screenCssPixelRatio);
    var browserToSize = {};
    browserToSize["Chrome"] = [20, 25];
}

function areErrorsConsistent(browserRef){
    
}

function getFingerprintInconsistencies(fp){
    // TODO apply my best algo here ...
    console.log(fp);
    console.log("Start finding inconsistencies");
    var ua = fp.userAgent;
    var parser = new UAParser();
    // ua = "Mozilla/5.0 (Windows NT 6.3; Trident/7.0; rv:11.0) like Gecko";
    parser.setUA(ua);
    var uaParsed = parser.getResult();
    console.log(uaParsed);
    var browserRef = uaParsed.browser.name;
    var osRef = uaParsed.os.name;
    var osVersionRef = uaParsed.os.version;
    console.log("browser ref: "+browserRef);
    console.log("os ref: "+osRef);
    console.log("os version ref: "+osVersionRef);

    // OS check
    if(fp.userAgent == fp.httpHeaders["User-Agent"]){
        console.log("The two user agents are the same");
    }else{
        console.log("The two user agents are different");
    }

    isPlatformOSrefConsistent(fp.platform, osRef);
    isPluginsOSrefConsistent(osRef, fp.plugins);
    checkOSMq(osRef, osVersionRef);
    // TODO add emojis?
    // add fonts linked to an os

    // isMissingImageConsistent(fp.unknownImageError, browserRef);
    areErrorsConsistent(browserRef);
}

generateFingerprint().then(function(val){
    console.log(val.httpHeaders);
    console.log(val.overwrittenObjects);
    url = "/add_fp"
    var xmlhttp;
    xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function(){
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200){
        }
    }
    xmlhttp.open("POST", url, true);
    xmlhttp.setRequestHeader("Content-type", "application/json");
    xmlhttp.send(JSON.stringify(val));
    getFingerprintInconsistencies(val);
});

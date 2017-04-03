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
      fp.canvas = getCanvasFp();
      fp.adBlock = getAdBlock();

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
      fp.stackOverflowDepth = generateStackOverflow();
      fp.webSocketError = generateWebSocketError();

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

      // Try to detect random agent spoofer extension ?
      // Try to detect ghostery of things like this ?
      
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

      return Promise.all([p1, p2, p3, p4]).then(function () {
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
	return protoNavigator;
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
	
	function inc(){
		try{
			depth++;
			inc();
		}catch(e){
			return depth;
		}
	}

	inc();
	return depth;
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


function getCanvasFp() {
	var result = [];
	// Very simple now, need to make it more complex (geo shapes etc)
	var canvas = document.createElement("canvas");
	canvas.width = 2000;
	canvas.height = 200;
	canvas.style.display = "inline";
	var ctx = canvas.getContext("2d");
	// detect browser support of canvas winding
	// http://blogs.adobe.com/webplatform/2013/01/30/winding-rules-in-canvas/
	// https://github.com/Modernizr/Modernizr/blob/master/feature-detects/canvas/winding.js
	ctx.rect(0, 0, 10, 10);
	ctx.rect(2, 2, 6, 6);
	result.push("canvas winding:" + ((ctx.isPointInPath(5, 5, "evenodd") === false) ? "yes" : "no"));

	ctx.textBaseline = "alphabetic";
	ctx.fillStyle = "#f60";
	ctx.fillRect(125, 1, 62, 20);
	ctx.fillStyle = "#069";
	// https://github.com/Valve/fingerprintjs2/issues/66
	ctx.font = "11pt no-real-font-123";
	ctx.fillText("Cwm fjordbank glyphs vext quiz, \ud83d\ude03", 2, 15);
	ctx.fillStyle = "rgba(102, 204, 0, 0.2)";
	ctx.font = "18pt Arial";
	ctx.fillText("Cwm fjordbank glyphs vext quiz, \ud83d\ude03", 4, 45);

	// canvas blending
	// http://blogs.adobe.com/webplatform/2013/01/28/blending-features-in-canvas/
	// http://jsfiddle.net/NDYV8/16/
	ctx.globalCompositeOperation = "multiply";
	ctx.fillStyle = "rgb(255,0,255)";
	ctx.beginPath();
	ctx.arc(50, 50, 50, 0, Math.PI * 2, true);
	ctx.closePath();
	ctx.fill();
	ctx.fillStyle = "rgb(0,255,255)";
	ctx.beginPath();
	ctx.arc(100, 50, 50, 0, Math.PI * 2, true);
	ctx.closePath();
	ctx.fill();
	ctx.fillStyle = "rgb(255,255,0)";
	ctx.beginPath();
	ctx.arc(75, 100, 50, 0, Math.PI * 2, true);
	ctx.closePath();
	ctx.fill();
	ctx.fillStyle = "rgb(255,0,255)";
	// canvas winding
	// http://blogs.adobe.com/webplatform/2013/01/30/winding-rules-in-canvas/
	// http://jsfiddle.net/NDYV8/19/
	ctx.arc(75, 75, 75, 0, Math.PI * 2, true);
	ctx.arc(75, 75, 25, 0, Math.PI * 2, true);
	ctx.fill("evenodd");

	return canvas.toDataURL();
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


function getFingerprintInconsistencies(fp){
    // TODO apply my best algo here ...
    console.log("Start finding inconsistencies");
}

generateFingerprint().then(function(val){
    console.log(val.httpHeaders);
    console.log(val.localIP);
    console.log(val.audio);
    console.log(val.unknownImageError);
    getFingerprintInconsistencies(val);
});

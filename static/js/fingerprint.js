function generateFingerprint(){
  return new Promise(function(resolve, reject){
    fp = {}
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
    // Since some tasks are async, maybe we should wrap all the fp generation
    // in a functionthat returns a promise
    // When the promise is fullfilled, then we return the
    // entire fingerprint
    this.generateUnknownImageError().then(function(val){
      fp.unknownImageError = val;
      resolve(fp);
    });
  });
  // this.noNewKeywordError = undefined;
  // this.generateNoNewKeywordError();

      // Look at https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Promise/all
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
			return [screen.availHeight, screen.availWidth];
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
			return [p.name, p.description, mimeTypes].join("::");
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
          resolve({width: image.width, height: image.height});
      }, 200);
    });
  }

 function generateNoNewKeywordError(){
    var a = Array(16);
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

generateFingerprint().then(function(val){
    console.log(val);
});


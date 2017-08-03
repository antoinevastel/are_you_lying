var ERROR = "error";

function generateFingerprint(){
    var fp = {}
    return new Promise(function(resolve, reject){
       var p4 = new Promise(function(resolve, reject){
          generateUnknownImageError().then(function(val){
              fp.unknownImageError = val;
              return resolve(fp);
          });
      });
      fp.userAgent = getUserAgent();
      fp.screenResolution = getScreenResolution();
      fp.availableScreenResolution = getAvailableScreenResolution();
      fp.platform = getNavigatorPlatform();
      fp.plugins = getPlugins().join(";;;");
      fp.canvas = getCanvasFp();
      fp.webGLInfo = getWebGL();
      fp.modernizr = testModernizr();
      fp.overwrittenObjects = testOverwrittenObjects();

      // New attributes
      fp.oscpu = getOscpu();
      fp.productSub = getProductSub();
      fp.touchSupport = getTouchSupport();
      fp.navigatorPrototype = getNavigatorPrototype();
      fp.resOverflow = generateStackOverflow();
      fp.errorsGenerated = generateErrors();
      fp.etsl = getEtsl();
      fp.osMediaqueries = getOSMq();

      fp.accelerometerUsed = false;
      window.ondevicemotion = function(event) {
          if(event.accelerationIncludingGravity.x != null){
            console.log("toto");
            console.log(event.accelerationIncludingGravity.x);
            fp.accelerometedUsed = true;
          } 
      }

      

      var p5 = new Promise(function(resolve, reject){
        getFontsEnum().then(function(val){
            fp.fontsEnum = val;
            return resolve(fp);
        })
      });

      // TODO: add p1 later
      // Problem currently if no private address
      return Promise.all([p4, p5]).then(function () {
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
    finalProto.push(prop+"~~~"+res);

  });
	return finalProto.join(";;;");
}

function getOSMq(){
    var queryMatchedColor = "red";
    var res = [];

    res.push(window.matchMedia("(-moz-mac-graphite-theme: 1)").matches);
    res.push(window.matchMedia("(-moz-os-version: windows-xp)").matches);
    res.push(window.matchMedia("(-moz-os-version: windows-vista)").matches);
    res.push(window.matchMedia("(-moz-os-version: windows-win7)").matches);
    res.push(window.matchMedia("(-moz-os-version: windows-win8)").matches);
    res.push(window.matchMedia("(-moz-os-version: windows-win10)").matches);

    return res.join(";");
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

function getEtsl() {
    return eval.toString().length;
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
    return [maxTouchPoints, touchEvent, touchStart].join(";");
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
		return navigator.languages.join("~~");
	}
	return "unknown";
}

function getMimeTypes(){
	var mimeTypes = [];
	for(var i = 0; i < navigator.mimeTypes.length; i++){
		var mt = navigator.mimeTypes[i];
		mimeTypes.push([mt.description, mt.type, mt.suffixes].join("~~"));
	}
	return mimeTypes.join(";;");
}

function getPluginsUsingMimeTypes(){
	var plugins = [];
	for(var i = 0; i < navigator.mimeTypes.length; i++){
		var mt = navigator.mimeTypes[i];
		plugins.push([mt.enabledPlugin.name, mt.enabledPlugin.description, mt.enabledPlugin.filename].join("::")+mt.type);
	}
	return plugins.join(";;");
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
	return [depth, errorName, errorMessage].join(";;;");
}


function getOscpu(){
	if(navigator.oscpu){
		return navigator.oscpu;
	}
	return "unknown";
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
	return [screen.width, screen.height].join(",");
}

function getAvailableScreenResolution(){
	if(screen.availWidth && screen.availHeight) {
		return [screen.availWidth, screen.availHeight].join(",");
	}
	return "unknown";
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
	try{
		canvas = document.createElement('canvas');
		var ctx = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
		if(ctx.getSupportedExtensions().indexOf("WEBGL_debug_renderer_info") >= 0) {
				webGLVendor = ctx.getParameter(ctx.getExtension('WEBGL_debug_renderer_info').UNMASKED_VENDOR_WEBGL);
				webGLRenderer = ctx.getParameter(ctx.getExtension('WEBGL_debug_renderer_info').UNMASKED_RENDERER_WEBGL);
		} else {
				webGLVendor = "Not supported";
				webGLRenderer = "Not supported";
		}
		return [webGLVendor, webGLRenderer].join(";;;");
	}catch(e){
		return "unknown;;;unkown";
	}
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
  return canvasData;
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
    return new Promise(function(resolve, reject){
        function getError(){
            var body = document.getElementsByTagName("body")[0];
            var image = document.createElement("img");
            image.src = "http://iloveponeydotcom32188.jg";
            image.setAttribute("id", "fakeimage");
            body.appendChild(image);
            image.onerror = function(){
                 resolve([image.width, image.height].join(";"));
            }
            image = document.getElementById("fakeimage");
                setTimeout(function(){
                       
                }, 1000);
        }
        if(document.readyState == "complete"){
              getError();
        }else{
          document.addEventListener("DOMContentLoaded", function(event){
            getError();
          });
      }
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
    req.onerror = function(e) {
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
        headersProperties = Object.getOwnPropertyNames(httpHeaders);
        res = [];
        headersProperties.forEach(function(prop){
            res.push(prop+";;"+httpHeaders[prop]);
        });
        resolve(res.join("~~~"));
      }, function(error) {
        reject(error);
      })
  });
}

function testModernizr(){
  var propertiesVec = [];
	try{
		var modernizrProperties = Object.getOwnPropertyNames(Modernizr);
		modernizrProperties.forEach(function(prop){
			if(typeof Modernizr[prop] == "boolean"){
				try{
					propertiesVec.push(prop+"-"+Modernizr[prop].toString());
				}catch(e){}
			}
		});
		return propertiesVec.join(";");
	}catch(e){return "";}
}


function testCanvasValue(imgData){
	if(imgData == ""){
		return "0;;"
	}

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
            isolatedCells.push([i-1, j-1]);
        }
      }
    }
  }

  return [nbZeroElts, isolatedCells.join("~~")].join(";;");
}

function getFontsEnum(){
    // Code taken from fingerprintjs2
    //var fontsToTest = "cursive;monospace;serif;sans-serif;fantasy;default;Arial;Arial Black;Arial Narrow;Arial Rounded MT Bold;Book Antiqua;Bookman Old Style;Bradley Hand ITC;Bodoni MT;Calibri;Century;Century Gothic;Casual;Comic Sans MS;Consolas;Copperplate Gothic Bold;Courier;Courier New;English Text MT;Felix Titling;Futura;Garamond;Geneva;Georgia;Gentium;Haettenschweiler;Helvetica;Impact;Jokerman;King;Kootenay;Latha;Liberation Serif;Lucida Console;Lalit;Lucida Grande;Magneto;Mistral;Modena;Monotype Corsiva;MV Boli;OCR A Extended;Onyx;Palatino Linotype;Papyrus;Parchment;Pericles;Playbill;Segoe Print;Shruti;Tahoma;TeX;Times;Times New Roman;Trebuchet MS;Verdana;Verona;Arial Cyr;Comic Sans MS;Arial Black;Chiller;Arial Narrow;Arial Rounded MT Bold;Baskerville Old Face;Berlin Sans FB;Blackadder ITC;Lucida Console;Symbol;Times New Roman;Webdings;Agency FB;Vijaya;Algerian;Arial Unicode MS;Bodoni MT Poster Compressed;Bookshelf Symbol 7;Calibri;Cambria;Cambria Math;Kartika;MS Mincho;MS Outlook;MT Extra;Segoe UI;Aharoni;Aparajita;Amienne;cursive;Academy Engraved LET;LCD;LuzSans-Book;sans-serif;ZWAdobeF;Eurostile;SimSun-PUA;Blackletter686 BT;Myriad Web Pro Condensed;Matisse ITC;Bell Gothic Std Black;David Transparent;Adobe Caslon Pro;AR BERKLEY;Australian Sunrise;Myriad Web Pro;Gentium Basic;Highlight LET;Adobe Myungjo Std M;GothicE;HP PSG;DejaVu Sans;Arno Pro;Futura Bk;DejaVu Sans Condensed;Euro Sign;Neurochrome;Bell Gothic Std Light;Jokerman Alts LET;Adobe Fan Heiti Std B;Baby Kruffy;Tubular;Woodcut;HGHeiseiKakugothictaiW3;YD2002;Tahoma Small Cap;Helsinki;Bickley Script;Unicorn;X-Files;GENISO;Frutiger SAIN Bd v.1;Opus;ZDingbats;ABSALOM;Vagabond;Year supply of fairy cakes;Myriad Condensed Web;Segoe Media Center;Coronet;Helsinki Metronome;Segoe Condensed;Weltron Urban;AcadEref;DecoType Naskh;Freehand521 BT;Opus Chords Sans;Enviro;SWGamekeys MT;Croobie;Arial Narrow Special G1;AVGmdBU;Candles;Futura Bk BT;Andy;QuickType;WP Arabic Sihafa;DigifaceWide;ELEGANCE;BRAZIL;Pepita MT;Nina;Geneva;OCR B MT;Futura;Blade Runner Movie Font;Allegro BT;Lucida Blackletter;AGA Arabesque;AdLib BT;Clarendon;Monotype Sorts;Alibi;Bremen Bd BT;mono;News Gothic MT;AvantGarde Bk BT;chs_boot;fantasy;Palatino;BernhardFashion BT;Courier New;CloisterBlack BT;Scriptina;Tahoma;BernhardMod BT;Virtual DJ;Nokia Smiley;Boulder;Andale Mono IPA;Belwe Lt BT;Calligrapher;Belwe Cn BT;Tanseek Pro Arabic;FuturaBlack BT;Abadi MT Condensed;Mangal;Chaucer;Belwe Bd BT;Liberation Serif;DomCasual BT;Bitstream Vera Sans;URW Gothic L;GeoSlab703 Lt BT;Bitstream Vera Sans Mono;Nimbus Mono L;Heather;Antique Olive;Clarendon Cn BT;Amazone BT;Bitstream Vera Serif;Utopia;Americana BT;Map Symbols;Bitstream Charter;Aurora Cn BT;CG Omega;Lohit Punjabi;Balloon XBd BT;Akhbar MT;Courier 10 Pitch;Benguiat Bk BT;Market;Cursor;Bodoni Bk BT;Letter Gothic;Luxi Sans;Brush455 BT;Sydnie;Lohit Hindi;Lithograph;Albertus;DejaVu LGC Serif;Lydian BT;Antique Olive Compact;KacstArt;Incised901 Bd BT;Clarendon Extended;Lohit Telugu;Incised901 Lt BT;GiovanniITCTT;KacstOneFixed;Folio XBd BT;Edda;Loma;Formal436 BT;Fine Hand;Garuda;Impress BT;RefSpecialty;Sazanami Mincho;Staccato555 BT;VL Gothic;Hkmer OS;WP BoxDrawing;Clarendon Blk BT;Droid Sans;CommonBullets;Sherwood;Helvetica;CopprplGoth Bd BT;Smudger Alts LET;BPG Rioni;CopprplGoth BT;Guitar Pro 5;Estrangelo TurAbdin;Dauphin;Arial Tur;English111 Vivace BT;Steamer;OzHandicraft BT;Futura Lt BT;Liberation Sans Narrow;Futura XBlk BT;Candy Round BTN Cond;GoudyHandtooled BT;GrilledCheese BTN Cn;GoudyOlSt BT;Galeforce BTN;Kabel Bk BT;Sneakerhead BTN Shadow;OCR-A BT;Denmark;OCR-B 10 BT;Swiss921 BT;PosterBodoni BT;Arial (Arabic);Serifa BT;FlemishScript BT;Arial;American Typewriter;Arial Black;Apple Symbols;Arial Narrow;AppleMyungjo;Arial Rounded MT Bold;Zapfino;Arial Unicode MS;BlairMdITC TT-Medium;Century Gothic;Cracked;Papyrus;KufiStandardGK;Plantagenet Cherokee;Courier;Helvetica;Baskerville Old Face;Apple Casual;Type Embellishments One LET;Bookshelf Symbol 7;Abadi MT Condensed Extra Bold;Calibri;Calibri Bold;Calisto MT;Chalkduster;Cambria;Franklin Gothic Book Italic;Century;Geneva CY;Franklin Gothic Book;Helvetica Light;Gill Sans MT;Academy Engraved LET;MT Extra;Bank Gothic;Eurostile;Bodoni SvtyTwo SC ITC TT-Book;Tekton Pro;Courier CE;Maestro;BO Futura BoldOblique;Lucida Bright Demibold;New;AGaramond;Charcoal;DIN-Black;Lucida Sans Demibold;Stone Sans OS ITC TT-Bold;AGaramond Italic;Bickham Script Pro Regular;Adobe Arabic Bold;AGaramond Semibold;Al Bayan Bold;Doremi;AGaramond SemiboldItalic;Arno Pro Bold;Casual;B Futura Bold;Frutiger 47LightCn;Gadget;HelveticaNeueLT Std Bold;Frutiger 57Cn;DejaVu Serif Italic Condensed;Myriad Pro Black It;Frutiger 67BoldCn;Gentium Basic Bold;Sand;GillSans;H Futura Heavy;Liberation Mono Bold;GillSans Bold;Cambria Math;Courier Final Draft;HelveticaNeue BlackCond;cursive;Techno;HelveticaNeue BlackCondObl;Gabriola;JazzText Extended;HelveticaNeue BlackExt;sans-serif;Textile;HelveticaNeue BlackExtObl fantasy;HelveticaNeue BoldCond;Palatino Linotype Bold;HelveticaNeue BoldCondObl;BIRTH OF A HERO;HelveticaNeue BoldExt;Bleeding Cowboys;HelveticaNeue BoldExtObl;ChopinScript;HelveticaNeue ExtBlackCond;LCD;HelveticaNeue ExtBlackCondObl;Myriad Web Pro Condensed;HelveticaNeue HeavyCond;Scriptina;HelveticaNeue HeavyCondObl;OpenSymbol;HelveticaNeue HeavyExt;Virtual DJ;HelveticaNeue HeavyExtObl;Guitar Pro 5;HelveticaNeue LightCondObl;Nueva Std;HelveticaNeue ThinCond;Chicago;HelveticaNeue ThinCondObl;Nueva Std Bold;Brush Script MT;Capitals;Myriad Web Pro;Avant Garde;B Avant Garde Demi;Nueva Std Bold Italic;BI Avant Garde DemiOblique;MaestroTimes;Univers BoldExtObl;APC Courier;Myriad Web Pro Bold;Liberation Serif;Myriad Pro Light;Carta;DIN-Bold;DIN-Light;Myriad Web Pro Condensed Italic;DIN-Medium;Tekton Pro Oblique;DIN-Regular;AScore;HelveticaNeue UltraLigCondObl;Opus;HelveticaNeue UltraLigExt;Myriad Pro Light It;HelveticaNeue UltraLigExtObl;Opus Chords Sans;HO Futura HeavyOblique;Opus Japanese Chords;L Frutiger Light;VT100;L Futura Light;Helsinki;LO Futura LightOblique;Helsinki Metronome;Myriad Pro Black;New York;O Futura BookOblique;R Frutiger Roman;Reprise;TradeGothic;Warnock Pro Bold Caption;Univers 45 Light;Warnock Pro;XBO Futura ExtraBoldOblique;Univers 45 LightOblique;Liberation Mono;Univers 55 Oblique;UC LCD;Univers 57 Condensed;Warnock Pro Bold;Univers ExtraBlack;Warnock Pro Light Ital Subhead;Univers LightUltraCondensed;Matrix Ticker;Univers UltraCondensed;Fang Song".split(";");
    var fontsToTest = ['Arial Narrow Gras', 'NewJumja', 'TSCu', 'Times Italique', 'CL', 'Latin Modern Roman Dunhill', 'Latin Modern Roman Unslanted', 'Helvetica Gras', 'Times New Roman Italique', 'Arial Narrow Gras Italique', 'MotoyaG04Mincho', 'Ume Gothic S4', 'SignPainter', 'Bordeaux Roman Bold LET', 'Ume Gothic O5', 'Latin Modern Mono Light Cond', 'Bell Gothic Std Light', 'pcf', 'boot', 'Latin Modern Mono', 'Arial Gras Italique', 'Police système Moyen', 'Letter Gothic', 'IV50', 'Trebuchet MS Gras Italique', 'Kohinoor Devanagari', 'Times Gras', 'cursor', 'Latin Modern Sans Demi Cond', 'Courier Gras', 'MSung B5HK', 'Police système Intense', 'Police système Gras', 'Courier New Gras Italique', 'Apple Emoji couleur', 'SAPDings', 'Coronet', 'Latin Modern Mono Prop', 'Georgia Gras Italique', 'Times Gras italique', 'Klee', 'Orange LET', 'TAMu', 'Ume Gothic S5', 'Ruach LET', 'Ume P Gothic O5', 'Arial Italique', 'ITF Devanagari', 'Nuosu SIL', 'Wolf', 'Trebuchet MS Gras', 'TG Pagella Math', 'Police système Léger', 'HolidayPi BT', 'Ro', 'Westwood LET', 'Latin Modern Mono Caps', 'Charlie', 'Ume P Gothic S4', 'Yuanti TC', 'Bradley Hand', 'Times New Roman Gras', 'HCR Batang', 'Ume P Mincho', 'Trebuchet MS Italique', 'msam10', 'SchoolHouse Printed A', 'ParkAvenue BT', 'stmary10', 'Earth', 'Tlwg Typewriter', 'Latin Modern Roman Demi', 'W', 'Courier New Italique', 'eufm10', 'Comic Sans MS Gras', 'Lohit Odia', 'Brush Script MT Italique', 'Bodoni 72', 'Arial Black Normal', 'Police système Courant', 'John Handy LET', 'Highlight LET', 'Kievit Offc Pro', 'Verdana Italique', 'AR PL UMing TW', 'Victorian LET', 'Ume Mincho S3', 'Laksaman', 'Ume Mincho', 'Smudger LET', 'Phosphate', 'La Bamba LET', 'Arial Gras', 'Bickham Script Pro Regular', 'Police système Italique', 'SAPIcons', 'Droid Sans Devanagari', 'Clarendon', 'Princetown LET', 'Odessa LET', 'Police système', 'Ume Gothic C4', 'University Roman LET', 'Ki', 'TG Termes Math', 'Latin Modern Roman Slanted', 'Quixley LET', 'Verdana Gras Italique', 'Times New Roman Gras Italique', 'Synchro LET', 'Georgia Gras', 'Blackletter686 BT', 'wasy10', '36p Kana', 'AR PL UMing TW MBE', 'HCR Dotum', 'Eeyek Unicode', 'rsfs10', 'MotoyaG04GothicMono', 'Scruff LET', 'Gabo Drive', 'Latin Modern Roman Caps', 'One Stroke Script LET', 'Rage Italic LET', 'Lohit Gurmukhi', 'Latin Modern Mono Slanted', 'Arial monospaced for SAP', 'Bodoni 72 Oldstyle', 'MotoyaG04Gothic', 'Ume P Gothic C4', 'PingFang HK', 'Oxygen-Sans', 'Ume P Gothic', 'Khmer OS Content', 'Tsukushi A Round Gothic', 'MSung GB18030', 'Latin Modern Sans Quotation', 'HyhwpEQ', 'Ume Gothic C5', 'Albertus Medium', 'Broadway BT', 'Tlwg Mono', 'Calligraph421 BT', 'FixedSys', 'MisterEarl BT', 'Cataneo BT', 'Pump Demi Bold LET', 'Latin Modern Mono Prop Light', 'Tahoma Gras', 'Marigold', 'Nimbus Sans Narrow', 'Microsoft Yahei', 'Bodoni 72 Smallcaps', 'SchoolHouse Cursive B', 'Mekanik LET', 'Montserrat SemiBold', 'Verdana Gras', 'Enigmatic Unicode', 'Ume Gothic', 'PingFang TC', 'Latin Modern Sans', 'URW Gothic', 'Bradley Hand Gras', 'WenQuanYi Zen Hei Sharp', 'PingFang SC', 'ITF Devanagari Marathi', 'Georgia Italique', 'Latin Modern Mono Light', 'P', 'Tiranti Solid LET', 'Garamond Premr Pro', 'Mona Lisa Solid ITC TT', 'Hiragino Sans', 'AR PL UMing HK', 'Virgo 01', 'AR PL UMing CN', 'Staccato222 BT', 'ori1Uni', 'Ume P Mincho S3', 'OldDreadfulNo7 BT', 'Latin Modern Roman', 'Milano LET', 'esint10', 'WST', 'IPT', 'Courier New Gras', 'Ume UI Gothic', 'Arial Narrow Italique', 'Fixed', 'msbm10', 'Ume P Gothic S5', 'Mishafi Gold', 'Police système Semi-gras', 'Noto Sans Emoji', 'Thonburi Gras', 'Ume UI Gothic O5', 'Roman SD', 'PakType Naqsh', 'Ostrich Sans Heavy', 'Ume P Gothic C5', 'BRK', 'MotoyaG04MinchoMono', 'Tsukushi B Round Gothic', 'IV25', '12x10'];
    return new Promise(function(resolve, reject){
      function runFontsEnum(){
            var baseFonts = ["monospace", "sans-serif", "serif"];
            var testString = "mmmmmmmmmmlli";
            var testSize = "72px";
            var h = document.getElementsByTagName("body")[0];

            // div to load spans for the base fonts
            var baseFontsDiv = document.createElement("div");

            // div to load spans for the fonts to detect
            var fontsDiv = document.createElement("div");

            var defaultWidth = {};
            var defaultHeight = {};

            // creates a span where the fonts will be loaded
            var createSpan = function() {
                var s = document.createElement("span");
                /*
                * We need this css as in some weird browser this
                * span elements shows up for a microSec which creates a
                * bad user experience
                */
                s.style.position = "absolute";
                s.style.left = "-9999px";
                s.style.fontSize = testSize;
                s.style.lineHeight = "normal";
                s.innerHTML = testString;
                return s;
            };

            var createSpanWithFonts = function(fontToDetect, baseFont) {
                var s = createSpan();
                s.style.fontFamily = "'" + fontToDetect + "'," + baseFont;
                return s;
            };

            var initializeBaseFontsSpans = function() {
                var spans = [];
                for (var index = 0, length = baseFonts.length; index < length; index++) {
                    var s = createSpan();
                    s.style.fontFamily = baseFonts[index];
                    baseFontsDiv.appendChild(s);
                    spans.push(s);
                }
                return spans;
            };

            var initializeFontsSpans = function() {
                var spans = {};
                for(var i = 0, l = fontsToTest.length; i < l; i++) {
                    var fontSpans = [];
                    for(var j = 0, numDefaultFonts = baseFonts.length; j < numDefaultFonts; j++) {
                        var s = createSpanWithFonts(fontsToTest[i], baseFonts[j]);
                        fontsDiv.appendChild(s);
                        fontSpans.push(s);
                    }
                    spans[fontsToTest[i]] = fontSpans; // Stores {fontName : [spans for that font]}
                }
                return spans;
            };

            var isFontAvailable = function(fontSpans) {
                var detected = false;
                for(var i = 0; i < baseFonts.length; i++) {
                    detected = (fontSpans[i].offsetWidth !== defaultWidth[baseFonts[i]] || fontSpans[i].offsetHeight !== defaultHeight[baseFonts[i]]);
                    if(detected) {
                        return detected;
                    }
                }
                return detected;
            };

            var baseFontsSpans = initializeBaseFontsSpans();

            // add the spans to the DOM
            h.appendChild(baseFontsDiv);

            // get the default width for the three base fonts
            for (var index = 0, length = baseFonts.length; index < length; index++) {
                defaultWidth[baseFonts[index]] = baseFontsSpans[index].offsetWidth; // width for the default font
                defaultHeight[baseFonts[index]] = baseFontsSpans[index].offsetHeight; // height for the default font
            }

            // create spans for fonts to detect
            var fontsSpans = initializeFontsSpans();

            // add all the spans to the DOM
            h.appendChild(fontsDiv);

            // check available fonts
            var available = [];
            for(var i = 0, l = fontsToTest.length; i < l; i++) {
                if(isFontAvailable(fontsSpans[fontsToTest[i]])) {
                    available.push(fontsToTest[i]+"--true");
                }else{
                    available.push(fontsToTest[i]+"--false");
                }
            }

            // remove spans from DOM
            h.removeChild(fontsDiv);
            h.removeChild(baseFontsDiv);
            return resolve(available.join(";;"));
        }


      if(document.readyState == "complete"){
        runFontsEnum();
      }else {
        document.addEventListener("DOMContentLoaded", function(event){
          runFontsEnum();
        });
      }
    });
}

function testOverwrittenObjects(){
    var screenTest;
    try{
        screenTest = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(screen), "width").get.toString();
    } catch(e){
        screenTest = ERROR;
    }
    var canvasTest;
    try{
        canvasTest = Object.getOwnPropertyDescriptor(window.HTMLCanvasElement.prototype, "toDataURL").value.toString();
    } catch(e){
        canvasTest = ERROR;
    }

    var dateTest;
    try{
        dateTest = Object.getOwnPropertyDescriptor(Date.prototype, "getTimezoneOffset").value.toString();
    } catch(e) {
        dateTest = ERROR;
    }

    // We separe with weird characters in case they use dash in their overwritten functions
    return screenTest+"~~~"+canvasTest+"~~~"+dateTest;
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

function generateErrors(){
    var errors = [];
    try{
        azeaze + 3;
    }catch(e){
        errors.push(e.message);
        errors.push(e.fileName);
        errors.push(e.lineNumber);
        errors.push(e.description);
        errors.push(e.number);
        errors.push(e.columnNumber);
        try{
            errors.push(e.toSource().toString());
        }catch(e){
            errors.push(undefined);
        }
    }

    try{
    var a = new WebSocket("itsgonnafail");
  }catch(e){
    errors.push(e.toString());
  }

    return errors.join("~~~");
}

setTimeout(function(){
var start = performance.now();
generateFingerprint().then(function(val){
    var finished = performance.now();
    var elapsedTimed = finished - start;
    console.log(elapsedTimed);
    console.log(val);

    url = "/save_time";
    var xmlhttp;
    xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function(){
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200){
        }
    }

    var res = {elapsedTimed: elapsedTimed, test:"att1"};
    xmlhttp.open("POST", url, true);
    xmlhttp.setRequestHeader("Content-type", "application/json");
    xmlhttp.send(JSON.stringify(res));
});
}, 1000);
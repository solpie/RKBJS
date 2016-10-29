/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var Env_1 = __webpack_require__(1);
	var localhost;
	var WebServer = (function () {
	    function WebServer(callback) {
	        this.initEnv(callback);
	        this.test();
	    }
	    WebServer.prototype.test = function () {
	    };
	    WebServer.prototype.initEnv = function (callback) {
	        var _this = this;
	        var process = __webpack_require__(3);
	        Env_1.ServerConf.isDev = process.defaultApp || /[\\/]electron-prebuilt[\\/]/.test(process.execPath);
	        console.log(process.execPath, Env_1.ServerConf.isDev);
	        var fs = __webpack_require__(4);
	        fs.readFile('resources/app/package.json', function (err, data) {
	            if (err)
	                throw err;
	            var dataObj = JSON.parse(data);
	            Env_1.ServerConf.port = dataObj.server.port;
	            _this.initServer();
	            _this.serverConf = Env_1.ServerConf;
	            console.log("server config:", Env_1.ServerConf);
	            if (callback)
	                callback(dataObj);
	        });
	    };
	    WebServer.prototype.initServer = function () {
	        var _this = this;
	        var express = __webpack_require__(5);
	        var app = express();
	        app.set('views', "./resources/app/view");
	        app.set('view engine', 'ejs');
	        app.use(express.static("./resources/app/static"));
	        var bodyParser = __webpack_require__(6);
	        app.use(bodyParser.urlencoded({ extended: false, limit: '55mb' }));
	        app.use(bodyParser.json({ limit: '50mb' }));
	        app.all("*", function (req, res, next) {
	            res.header('Access-Control-Allow-Origin', '*');
	            res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
	            res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
	            if (req.method == 'OPTIONS') {
	                res.send(200);
	            }
	            else {
	                next();
	            }
	        });
	        app.get('/', function (req, res) {
	            res.send('hello' + new Date().getDate());
	        });
	        app.listen(Env_1.ServerConf.port, function () {
	            _this.initSocketIO();
	            console.log("server on:  ws port:");
	        });
	    };
	    WebServer.prototype.initSocketIO = function () {
	    };
	    return WebServer;
	}());
	exports.WebServer = WebServer;
	exports.serverConf = Env_1.ServerConf;
	exports.webServer = new WebServer();


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var Node_path = __webpack_require__(2);
	exports._path = function (path) {
	    if (!exports.ServerConf.isDev)
	        return Node_path.join('resources', path);
	    return path;
	};
	exports._asar = function (path) {
	};
	exports.ServerConf = { isDev: false, hupuWsUrl: '' };


/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = require("path");

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = require("process");

/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = require("fs");

/***/ },
/* 5 */
/***/ function(module, exports) {

	module.exports = require("express");

/***/ },
/* 6 */
/***/ function(module, exports) {

	module.exports = require("body-parser");

/***/ }
/******/ ]);
//# sourceMappingURL=WebServer.js.map
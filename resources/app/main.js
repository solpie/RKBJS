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
/******/ ({

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(__dirname) {var _a = __webpack_require__(15), app = _a.app, BrowserWindow = _a.BrowserWindow, ipcMain = _a.ipcMain;
	var win;
	function onReady() {
	    openWin();
	}
	var spawn = __webpack_require__(16).spawn;
	var watchView;
	var watchServer;
	var isWatch = false;
	var sender;
	function devWatch() {
	    if (isWatch) {
	        return;
	    }
	    isWatch = true;
	    function sendServer(data) {
	        sender.send('logServer', data);
	    }
	    function sendView(data) {
	        sender.send('logView', data);
	    }
	    watchView = spawn('npm.cmd', ['run', 'view'], {
	        detached: false,
	        stdio: ['ignore']
	    });
	    watchView.stdout.on('data', sendView);
	    watchView.stderr.on('data', sendView);
	    watchView.on('close', sendView);
	    watchServer = spawn('npm.cmd', ['run', 'server'], {
	        detached: false
	    });
	    watchServer.stdout.on('data', sendServer);
	    watchServer.stderr.on('data', sendServer);
	    watchServer.on('close', sendServer);
	}
	function killWatch() {
	    if (watchView) {
	        watchView.kill('SIGKILL');
	    }
	    if (watchServer) {
	        watchServer.kill('SIGKILL');
	    }
	}
	var isDev = /[\\/]electron-prebuilt[\\/]/.test(process.execPath);
	function openWin(serverConf) {
	    ipcMain.on('open-devtool', function (event, status) {
	        win.toggleDevTools({ mode: 'detach' });
	    });
	    ipcMain.on('devWatch', function (event, arg) {
	        sender = event.sender;
	        devWatch();
	    });
	    win = new BrowserWindow({
	        width: 500, height: 540,
	        resizable: false,
	        frame: true,
	        autoHideMenuBar: false,
	        webaudio: false
	    });
	    win.setMenuBarVisibility(false);
	    win.loadURL("file://" + __dirname + "resources/app/index.html");
	    win.toggleDevTools({ mode: 'detach' });
	    win.on('closed', function () {
	        win = null;
	    });
	}
	app.on('ready', onReady);
	app.on('window-all-closed', function () {
	    console.log('window-all-closed');
	    killWatch();
	    if (process.platform !== 'darwin') {
	        app.quit();
	    }
	});
	app.on('activate', function () {
	    if (win === null) {
	    }
	});
	
	/* WEBPACK VAR INJECTION */}.call(exports, "/"))

/***/ },

/***/ 15:
/***/ function(module, exports) {

	module.exports = require("electron");

/***/ },

/***/ 16:
/***/ function(module, exports) {

	module.exports = require("child_process");

/***/ }

/******/ });
//# sourceMappingURL=main.js.map
import {PanelId} from "./view/libsES6";
import express, {Router} from "express";
import mustacheExpress from "mustache-express";
import bodyParser from "body-parser";
import SocketIO from "socket.io";
import {description} from "../resources/app/package.json";
class WebServerES6 {
    init() {
        console.log('hello', description);
        // var express = require('express');
        var app = express();

        // template engine setup
        app.set('views', "./resources/app/view");
        // app.set('view engine', 'ejs');


// Register '.mustache' extension with The Mustache Express
        app.engine('mustache', mustacheExpress());

        app.set('view engine', 'mustache');
        // app.set('views', __dirname + '/views');


        ///
        app.use(express.static("./resources/app/static"));//
        // app.use('/static', express.static(_path("./app/static")));//
        // app.use(express.static(_path("./app/db")));//
        // var urlencodedParser = bodyParser.urlencoded({
        //     extended: false
        //     , limit: '55mb'
        // });
        // var bodyParser = require('body-parser');
        app.use(bodyParser.urlencoded({extended: false, limit: '55mb'}));// create application/x-www-form-urlencoded parser
        app.use(bodyParser.json({limit: '50mb'}));


        app.all("*", function (req, res, next) {
            res.header('Access-Control-Allow-Origin', '*');
            res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
            res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
            if (req.method == 'OPTIONS') {
                res.send(200);
            } else {
                next();
            }
        });


        app.get('/', function (req, res) {
            res.send('hello' + new Date().getSeconds());
            // res.redirect('/admin');
        });

        // app.use('/admin', adminRouter);
        // app.use('/panel', panelRouter);
        // app.use('/db', dbRouter);
        // app.use('/m', mobileRouter);
        // app.use('/dmk', dmkRouter);

        app.get('/panel', function (req, res) {
            console.log('get panel:');
            res.render('panel.mustache', {});
        });

        // var server = require('http').createServer(app);
        var server = require('http').Server(app);
        // var SocketIO = require('socket.io');
        var io = new SocketIO(server);
        // var io = require('socket.io')(server);
        io.on('connection', function () { /* … */
        });
        io = io.of(`/${PanelId.rkbPanel}`);
        io
            .on("connect", (socket) => {
                console.log('connect');
                // socket.emit(`${CommandId.initPanel}`, ScParam({gameInfo: "", isDev: ServerConf.isDev}));
            })
            .on('disconnect', function (socket) {
                console.log('disconnect');
            });

        server.listen(80);
    }

    constructor() {
        // var ejsss = require('ejs');
        console.log('hello');
    }
}
var webServer = new WebServerES6();
webServer.init();
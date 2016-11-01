// import {adminRouter} from "./router/AdminRouter";
// import {initDB} from "./model/DbInfo";
import {ServerConf} from "./Env";
import {adminRouter} from "./router/AdminRouter";
// import {dbRouter} from "./router/DbRouter";
// import {SocketIOSrv} from "./SocketIOSrv";
import {panelRouter} from "./router/PanelRouter";
import {CommandId} from "./view/Command";
import {PanelId, ScParam} from "./view/libs";
// import {mobileRouter} from "./router/MobileRouter";
// import {dmkRouter} from "./router/DmkRouter";
// import {startRtmpServer} from "./utils/rtmpServer/rtmpServer2";
/**
 * WebServer
 */
export class WebServer {
    // _path: any;
    serverConf: any;
    // socketIO: SocketIOSrv;

    constructor(callback?: any) {
        this.initEnv(callback);
        // this.initGlobalFunc();
        // this.initNedb();
        this.test();
    }

    test() {
    }

    //
    // initNedb() {
    //     initDB();
    // }


    initEnv(callback: any) {
        var process = require("process");
        ServerConf.isDev = process.defaultApp || /[\\/]electron-prebuilt[\\/]/.test(process.execPath);
        console.log(process.execPath, ServerConf.isDev);
        var fs = require('fs');
        fs.readFile('resources/app/package.json', (err: any, data: any)=> {
            if (err) throw err;
            var dataObj = JSON.parse(data);
            ServerConf.port = dataObj.server.port;
            this.initServer();
            this.serverConf = ServerConf;
            console.log("server config:", ServerConf);
            if (callback)
                callback(dataObj);
        });
    }

    initServer() {
        // var ejsss = require('ejs');
        var express: any = require('express');
        var app = express();

        // template engine setup
        app.set('views', "./resources/app/view");
        // app.set('view engine', 'ejs');

        var mustacheExpress = require('mustache-express');

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
        var bodyParser = require('body-parser');
        app.use(bodyParser.urlencoded({extended: false, limit: '55mb'}));// create application/x-www-form-urlencoded parser
        app.use(bodyParser.json({limit: '50mb'}));


        app.all("*", function (req: any, res: any, next: any) {
            res.header('Access-Control-Allow-Origin', '*');
            res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
            res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
            if (req.method == 'OPTIONS') {
                res.send(200);
            } else {
                next();
            }
        });


        app.get('/', function (req: any, res: any) {
            // res.send('hello' + new Date().getDate());

            res.redirect('/admin');
        });

        app.use('/admin', adminRouter);
        app.use('/panel', panelRouter);
        // app.use('/db', dbRouter);
        // app.use('/m', mobileRouter);
        // app.use('/dmk', dmkRouter);

        var server = require('http').createServer(app);
        var io = require('socket.io')(server);
        io.on('connection', function(){ /* … */ });
        io = io.of(`/${PanelId.rkbPanel}`);
        io
            .on("connect", (socket) => {
                console.log('connect');
                socket.emit(`${CommandId.initPanel}`, ScParam({gameInfo: "", isDev: ServerConf.isDev}));
            })
            .on('disconnect', function (socket) {
                console.log('disconnect');
            });

        server.listen(ServerConf.port);
        //
        // app.listen(ServerConf.port, () => {
        //     this.initSocketIO(app);
        //     // this.initRtmpServer();
        //     //and... we're live
        //     console.log("server on:  ws port:");
        // });
    }

    initSocketIO(app) {
        var io = require('socket.io')(app);
        io = io.of(`/${PanelId.rkbPanel}`);
        io
            .on("connect", (socket) => {
                console.log('connect');
                socket.emit(`${CommandId.initPanel}`, ScParam({gameInfo: "", isDev: ServerConf.isDev}));
            })
            .on('disconnect', function (socket) {
                console.log('disconnect');
            });
        // this.socketIO = new SocketIOSrv();
    }
}
export var serverConf = ServerConf;
export var webServer = new WebServer();


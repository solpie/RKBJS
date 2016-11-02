import {adminRouter} from "./router/AdminRouter";
import {ServerConf} from "./Env";
import {panelRouter} from "./router/PanelRouter";
import {PanelId, ScParam} from "./view/const";
import {CommandId} from "./view/Command";
/**
 * WebServer
 */
export default class WebServer {

    serverConf: any;
//
    constructor(callback?: any) {
        this.initEnv(callback);
        // // this.initGlobalFunc();
        // // this.initNedb();
        this.test();
    }

//
    test() {
        // var nodeLibs = require('./WebServer.min');
        // console.log("nodeLibs", nodeLibs, nodeLibs.express);
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
        // var express: any = require('express');
        var app = express();

        // template engine setup
        app.set('views', "./resources/app/view");

        app.engine('ejs', ejs.renderFile);
        app.set('view engine', 'ejs');


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


        app.all("*", function (req: any, res: any, next: any) {
            var start = new Date;

            res.header('Access-Control-Allow-Origin', '*');
            res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
            res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
            if (req.method == 'OPTIONS') {
                res.send(200);
            } else {
                next();
                var ms = new Date - start;
                console.log('%c%s %s - %s ms', "color: Green;font-weight:bold; background-color: LimeGreen;", req.method, req.url, ms);
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
        //
        server.listen(ServerConf.port, () => {
            this.initSocketIO(server);
            //and... we're live
            console.log("server on:", ServerConf.port);
        });
    }

    initSocketIO(server) {
        var io = new SocketIO(server);

        io.on('connection', function () { /* … */
        });
        io = io.of(`/${PanelId.rkbPanel}`);
        io
            .on("connect", (socket) => {
                console.log('connect');
                socket.emit(`${CommandId.initPanel}`, ScParam({gameInfo: "", isDev: ServerConf.isDev}));
            })
            .on('disconnect', function (socket) {
                console.log('disconnect');
            });
    }
}

export var webServer = new WebServer();


import {adminRouter} from "./router/AdminRouter";
import {ServerConf} from "./Env";
import {panelRouter, initIO} from "./router/PanelRouter";
import {RkbModel} from "./model/RkbModel";
declare let ejs;
declare let request;
let fs1 = require('fs');
let path = require('path');
let os = require('os');
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
        // let nodeLibs = require('./WebServer.min');
        // console.log("nodeLibs", nodeLibs, nodeLibs.express);
    }

    //
    // initNedb() {
    //     initDB();
    // }
    initEnv(callback: any) {
        let process = require("process");
        ServerConf.isDev = process.defaultApp || /[\\/]electron-prebuilt[\\/]/.test(process.execPath);
        console.log(process.execPath, ServerConf.isDev);
        let fs = require('fs');
        fs.readFile('resources/app/package.json', (err: any, data: any)=> {
            if (err) throw err;
            let dataObj = JSON.parse(data);
            ServerConf.port = dataObj.server.port;
            this.initServer();
            this.serverConf = ServerConf;
            console.log("server config:", ServerConf);
            if (callback)
                callback(dataObj);
        });
    }

    initServer() {
        // let express: any = require('express');
        let app = express();

        // template engine setup
        app.set('views', "./resources/app/ejs");

        app.engine('ejs', ejs.renderFile);
        app.set('view engine', 'ejs');

        ///
        app.use(express.static("./resources/app/static"));//
        // app.use('/static', express.static(_path("./app/static")));//
        // app.use(express.static(_path("./app/db")));//
        // let urlencodedParser = bodyParser.urlencoded({
        //     extended: false
        //     , limit: '55mb'
        // });
        // let bodyParser = require('body-parser');
        app.use(bodyParser.urlencoded({extended: false, limit: '55mb'}));// create application/x-www-form-urlencoded parser
        app.use(bodyParser.json({limit: '50mb'}));


        app.all("*", function (req: any, res: any, next: any) {
            let start: number = new Date().getTime();

            res.header('Access-Control-Allow-Origin', '*');
            res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
            res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
            if (req.method == 'OPTIONS') {
                res.send(200);
            } else {
                next();
                let ms: number = new Date().getTime() - start;
                if (req.url.search('.png') > -1) {
                }
                else
                    console.log('%c%s %s - %s ms', "color: Green;font-weight:bold; background-color: LimeGreen;", req.method, req.url, ms);
            }
        });


        app.get('/', function (req: any, res: any) {
            // res.send('hello' + new Date().getDate());
            res.redirect('/admin');
        });

        app.get('/get', function (req: any, res: any) {
            let url = req.query.url;
            //todo: no rest
            rest(url).then((response)=> {
                res.send(response)
            });
        });

        app.get('/proxy', function (req, res) {
            // let url = req.query.url;
            // request(url).pipe(res);

            // let url = req.query.url;
            // let filename = getUrlFilename(url);
            // request(url).pipe(fs1.createWriteStream('./cache/' + filename).on("close", ()=> {
            //     console.log("cache img:", filename);
            //     res.sendFile(path.resolve('./cache/' + filename))
            // }));

            // request.get(url).pipe(request.put('http://127.0.0.1/'+filename))

            let url = req.query.url;
            // request.defaults({encoding: null});
            request.get({url: url, encoding: null}, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    let data = "data:image/png;base64," + body.toString('base64');
                    res.send(data);
                }
            });
        });

        app.use('/admin', adminRouter);
        app.use('/panel', panelRouter);
        // app.use('/db', dbRouter);
        // app.use('/m', mobileRouter);
        // app.use('/dmk', dmkRouter);

        let server = require('http').createServer(app);
        //
        server.listen(ServerConf.port, () => {
            this.initSocketIO(server);
            //and... we're live
            console.log("server on:", ServerConf.port);
        });
    }

    initSocketIO(server) {
        let io = new SocketIO(server);
        let rkbModel = new RkbModel(io);
        initIO(io);
    }
}

export let webServer = new WebServer();


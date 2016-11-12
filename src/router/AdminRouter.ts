declare var express;
export var adminRouter = express.Router();

adminRouter.get('/', function (req: any, res: any) {
    res.render('admin', {version: 0.5, opUrlArr: ['http://123', '21'].toString()});
    // res.render('admin/index.mustache', {version: 0.5, opUrlArr: "['http://123', '21']"});
});


adminRouter.get('/sync/:gameId', function (req: any, res: any) {
    var gameId = req.params.gameId;
    res.send("同步面板时间 Game Id：" + gameId);
});
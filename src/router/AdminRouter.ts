declare var express;
export var adminRouter = express.Router();

adminRouter.get('/', function (req: any, res: any) {
    res.render('admin', {version: 0.5, opUrlArr: ['http://123', '21'].toString()});
    // res.render('admin/index.mustache', {version: 0.5, opUrlArr: "['http://123', '21']"});
});
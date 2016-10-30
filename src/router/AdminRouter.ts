export var adminRouter = require('express').Router();

adminRouter.get('/', function (req: any, res: any) {
    // res.render('admin/index', {version: 0.5, opUrlArr: ['http://123', '21']});
    res.render('admin/index.mustache', {version: 0.5, opUrlArr: "['http://123', '21']"});
});
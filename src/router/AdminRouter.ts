export var adminRouter = require('express').Router();

adminRouter.get('/', function (req: any, res: any) {
    res.render('admin/index', {version: 0.5, opUrlArr: ['http://123', '21']});
});
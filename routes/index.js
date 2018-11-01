// var express = require('express');
// var router = express.Router();
//
// /* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });
//
module.exports = function(app, express) {
    var ctrl = require('./../app/controller');
    var userCtrl = ctrl.users;
    var authCtrl = ctrl.authenticate;
    var authApi = require('./../app/config/auth');
    var router = express.Router();

    router.get('/verifyEmailUrl/:token', authCtrl.verifyEmail)
    app.use('/', router);
};

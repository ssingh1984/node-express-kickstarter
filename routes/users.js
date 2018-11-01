module.exports = function(app, express) {
  var ctrl = require('./../app/controller');
  var userCtrl = ctrl.users;
  var authCtrl = ctrl.authenticate;
  var authApi = require('./../app/config/auth');
  var router = express.Router();

  router.post('/registration', authCtrl.registration);
  router.post('/loginUser', authCtrl.loginUser);
  router.post('/forgotPasswordOtp', authCtrl.forgotPasswordOtp);
  router.post('/checkOtp', authCtrl.checkOtp);
  router.post('/resetPassword', authCtrl.resetPassword);
  app.use('/users', router);
}

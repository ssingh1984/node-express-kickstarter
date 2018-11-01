var Users = require('./../../services/users');
var Boom = require('boom');
var Common = require('./../config/common');
var Emails = require('./../config/emails');
var Jwt = require('jsonwebtoken');
var privateKey = process.env.PWD_KEY;
exports.findAll =  function(request, reply) {
    reply('yes');
}
/****************************************************/
// Filename: user.js
// Created: Navish Kumar
// Change history:
// 25.09.2018 / Navish
/****************************************************/

/* registration of end user 25.09.2018 By Navish */
exports.registration = async function(req, res) {
  var payloadData = req.body;
  var userInfo = {};
    userInfo.email = (payloadData.email != '' ? payloadData.email : '');
    userInfo.firstName = (payloadData.firstName != '' ? payloadData.firstName : '');
    userInfo.lastName = (payloadData.lastName != '' ? payloadData.lastName : '');
    userInfo.fullName = userInfo.firstName+" "+userInfo.lastName;
    userInfo.userName = (payloadData.userName != '' ? payloadData.userName : '');
    userInfo.phoneNumber = (payloadData.phoneNumber != '' ? payloadData.phoneNumber : '');
    userInfo.socialType = payloadData.socialType;
    userInfo.socialId = payloadData.socialId;
    userInfo.profilePic = payloadData.profilePic;
    userInfo.coverPic = payloadData.coverPic;
    userInfo.birthDate = payloadData.birthDate;
    userInfo.gender = payloadData.gender;
    userInfo.bio = payloadData.bio;
    // userInfo.otp = "";
  switch (payloadData.socialType) {
    case 'normal':
    Users.findusers(1, {"email": payloadData.email, 'socialType': 'normal'}, function(err, userObj) {
        if(userObj){
          if(userObj.isVerified == true){
            return res.send(Boom.forbidden("Email is already exists, please provide another user email.").output.payload);
          }else {
            var tokenData = {
              name: userObj.fullName,
              id: userObj._id,
              tokenTime:new Date()
            };
            userObj.token = Common.getToken(tokenData)
            Emails('RegisterLink', userObj.email, userObj, function(err, response) {
                if(!err){
                  res.send(Common.successResponse('Your email is not confirmed, please confirm your email id by clicking on link in email', userObj));
                }
            });
          }
        }else {
          userInfo.password = Common.encrypt(payloadData.password);
          Users.createuser(userInfo, function(err, userObj) {
            if (!err) {
                var tokenData = {
                    name: userObj.fullName,
                    id: userObj._id,
                    tokenTime:new Date()
                };
                userObj.token = Common.getToken(tokenData)
                Emails('RegisterLink', userObj.email, userObj, function(err, response) {
                    if(!err){
                      res.send(Common.successResponse('Please confirm your email id by clicking on link in email', userObj));
                    }
                });
            } else {
                if (11000 === err.code || 11001 === err.code) {
                    res.send(Common.errorResponse("forbidden", "Please provide another user email"));
                } else res.send(Common.errorResponse("forbidden", err)); // HTTP 403
            }
          })
        }
    });

      break;
    default:
      userInfo.isVerified = true;
      if(payloadData.socialId == "") return res.send(Common.errorResponse("forbidden","Please provide socialId."));
      Users.findusers(1, {'socialId': userInfo.socialId},function(err, userObj) {
        if(!err){
          if(userObj)
          {
            Users.updateUser({'_id': userObj._id},{isDeleted : false}, {new: true}, function(err, userObj) {
              console.log(err, userObj);
                if(!err){
                  var tokenData = {
                      name: userObj.fullName,
                      id: userObj._id
                  };
                  userObj.token = Common.getToken(tokenData)
                  userObj.alreadyExist = true;
                  userObj = Common.customeResponse(['createdAt', 'updatedAt','__v'], userObj)
                  res.send(Common.successResponse('Successfully authenticated!', userObj));
                }
                else
                {
                    return res.send(Common.errorResponse("forbidden",err));
                }
            });
          }
          else
          {
              Users.createuser(userInfo, function (err, userObj) {
                  if(!err)
                  {
                    var tokenData = {
                        name: userObj.name,
                        id: userObj._id
                    };
                    userObj.token = Common.getToken(tokenData)
                    userObj.alreadyExist = false;
                    userObj = Common.customeResponse(['createdAt', 'updatedAt', '__v'], userObj)
                    res.send(Common.successResponse('Successfully authenticated!', userObj));
                  }
                  else
                  {
                      return res.send(Common.errorResponse("badImplementation",err));
                  }
              });
          }
      }
      else
      {
          return res.send(Common.errorResponse("badImplementation",err));
      }
  });


  }

}

/****************************************************/
// Filename: user.js
// Created: Navish Kumar
// Change history:
// // 25.09.2018 / Navish
// /****************************************************/

/* login of end user 25.09.2018 By Navish */
exports.loginUser = function (req, res) {
    Users.findusers(1, {'email': req.body.email, 'socialType': 'normal'},function(err, userObj) {
      // console.log(err, userObj);
      // console.log('----------', req.body.password, Common.decrypt(userObj.password));
        if (!err) {
            if (userObj === null) return res.send(Common.errorResponse("forbidden", "Invalid username or password"));
            if (req.body.password === Common.decrypt(userObj.password)) {
              if(userObj.isVerified == false){
                var tokenData = {
                  name: userObj.fullName,
                  id: userObj._id,
                  tokenTime:new Date()
                };
                userObj.token = Common.getToken(tokenData)
                Emails('RegisterLink', userObj.email, userObj, function(err, response) {
                    if(!err){
                      return res.send(Common.errorResponse("forbidden", 'Your email is not confirmed, please confirm your email id by clicking on link in email', userObj));
                    }
                });
              }else {
                var tokenData = {
                    name: userObj.name,
                    id: userObj._id
                };
                userObj.token = Common.getToken(tokenData)
                userObj = Common.customeResponse(['createdAt', 'updatedAt','__v'], userObj)
                return res.send(Common.successResponse('Successfully authenticated!', userObj));
              }

                // if(!userObj.isVerified) return res.send(Common.errorResponse("forbidden", "Your email address is not verified. please verify your email address to proceed", userObj));


            } else res.send(Common.errorResponse("forbidden", "Invalid username or password."));
        } else {
            if (11000 === err.code || 11001 === err.code) {
                return res.send(Common.errorResponse("forbidden", "Please provide another user email"));
            } else {
                console.error(err);
                return res.send(Common.errorResponse("badImplementation", err));
            }
        }
    });
}

// /****************************************************/
// // Filename: user.js
// // Created: Navish Kumar
// // Change history:
// // 25.09.2018 / Navish
// /****************************************************/
//
// /* detail of user of end user 25.09.2018 By Navish */
// exports.userDetails = function(request, reply) {
//   var userId = Common.getUserId(request.headers.authorization);
//   var query = {_id : userId};
//   Users.findusers(1, query, function(err, userObj){
//     console.log('userObj', userObj);
//     if(err){
//       return reply(Boom.badImplementation(err));
//     } else if(!userObj){
//
//       return reply(Boom.notFound('User not found'));
//     } else {
//       var userObj = userObj.toObject();
//       reply(Common.successResponse('Successfully fetched!', userObj));
//     }
//   });
// }

/****************************************************/
// Filename: user.js
// Created: Navish Kumar
// Change history:
// 23.02.2018 / Navish
/****************************************************/

/* forgot password for end user 23.02.2018 By Navish */
exports.forgotPassword = function(request, reply) {
  Users.findusers(1, {'email': request.payload.email},function(err, userObj) {
      if (!err) {
          if (userObj === null) return res.send(Common.errorResponse("forbidden", "invalid email"));

          userObj.password = Common.decrypt(userObj.password);
          Emails('ForgotPassword', userObj.email, userObj, function(err, response) {
              if(!err){
                reply(Common.successResponse('Password is send to registered email id!', userObj));
              }
          });

      } else {
          console.error(err);
          return res.send(Common.errorResponse("badImplementation", err));
      }
  });
}

// /****************************************************/
// // Filename: user.js
// // Created: Navish Kumar
// // Change history:
// // 25.09.2018 / Navish
// /****************************************************/

// /* forgot password for end user 25.09.2018 By Navish */
exports.forgotPasswordOtp = function(req, res) {
  console.log(req.body);
  Users.findusers(1, {'email': req.body.email, 'socialType': 'normal'},function(err, userObj) {
      if (!err) {
          if (userObj === null) return res.send(Common.errorResponse("forbidden", "Invalid Email.Please try again."));
          if(!userObj.isVerified) return res.send(Common.errorResponse("forbidden", "Your email address is not verified. please verify your email address to proceed"));
          userObj.otp = Common.randomNumber(4);
          Emails('ForgotPasswordOtp', userObj.email, userObj, function(err, response) {
              if(!err){
                var query = {"_id":userObj._id};
                userObj.otp = userObj.otp;
                userObj.otpCreatedTime = new Date()
                Users.updateUser(query, userObj, {}, function(err, user){
                    if (err) {
                        console.error(err);
                        return res.send(Common.errorResponse("badImplementation", err));
                    }else{
                      var obj = {"_id":userObj.id}
                      return res.send(Common.successResponse('OTP is sent successfully to registered email id!',obj));
                    }

                });

              }
          });

      } else {
          console.error(err);
          return res.send(Common.errorResponse("badImplementation", err));
      }
  });
};

/****************************************************/
// Filename: user.js
// Created: Navish
// Change history:
// 04.10.2018 /
//Description : Check otp is correct or not
/****************************************************/
exports.checkOtp = function(req, res){
     var payload = req.body;
     Users.findusers(1, {"_id": req.body.userId},function(err, userObj) {
       console.log(err, userObj, req.body.userId);
         if (!err) {
           var otpCreatedTime = userObj.otpCreatedTime;
           var timeDiff =  new Date() - new Date(otpCreatedTime);
           var minutes = Math.floor(timeDiff / 60000);
           console.log('minutes',minutes,otpCreatedTime);
           if(minutes>30){
             return res.send(Common.createdResponse("Your OTP is either expired or invalid.Please send again."));
          }else{
            console.log(payload.otp, userObj.otp);
             if(payload.otp == userObj.otp){
               return res.send(Common.successResponse('Successfully authenticated'));
             }else{
               return res.send(Common.createdResponse("Your OTP is either expired or invalid.Please send again."));
             }

           }
         }else {
             console.error(err);
             return res.send(Common.errorResponse("badImplementation", err));
         }
     })
}


/****************************************************/
// Filename: user.js
// Created: Navish
// Change history:
// 27.09.2018 /
//Description : Reset Password
/****************************************************/
exports.resetPassword = function(req, res){
     var payload = req.body;
     Users.findusers(1, {"_id": req.body.userId},function(err, userObj) {
       console.log(err, userObj, req.body.userId);
         if (!err) {
           var otpCreatedTime = userObj.otpCreatedTime;
           var timeDiff =  new Date() - new Date(otpCreatedTime);
           var minutes = Math.floor(timeDiff / 60000);
           console.log('minutes',minutes,otpCreatedTime);
           if(minutes>30){
             return res.send(Common.createdResponse("Your OTP is either expired or invalid.Please send again."));
          }else{
            console.log(payload.otp, userObj.otp);
             if(payload.otp == userObj.otp){
               var query = {"_id":payload.userId}
               userObj.password = Common.encrypt(payload.password);
               userObj.otp = "",
               userObj.otpCreatedTime="";
               Users.updateUser(query, userObj, {}, function(err, user){
                  if (err) {
                       console.error(err);
                       return res.send(Common.errorResponse("badImplementation", err));
                   }
                   return res.send(Common.successResponse('Password set successfully'));
               })
             }else{
               return res.send(Common.createdResponse("Your OTP is either expired or invalid.Please send again."));
             }

           }
         }else {
             console.error(err);
             return res.send(Common.errorResponse("badImplementation", err));
         }
     })
}
// /****************************************************/
// // Filename: user.js
// // Created: Navish Kumar
// // Change history:
// // 25.09.2018 / Navish
// /****************************************************/
//
// /* email verificatiaon of end user 25.09.2018 By Navish */
exports.verifyEmail = function(req, res) {
  if(req.params.token){
    var userId = Common.getUserId(req.params.token);
    var tokenTime = Common.getJwtDecode(req.params.token).tokenTime;
    var timeDiff =  new Date() - new Date(tokenTime);
    var minutes = Math.floor(timeDiff / 60000);
    if(minutes>30){
        return res.send(Common.createdResponse("Your link has been expired."));
    }
        var query = {
          _id : userId
        }
        Users.findusers(1, query, function(err, user){
            if (err) {
                console.error(err);
                return res.send(Common.errorResponse("badImplementation", err));
            }
            if (user === null) return res.send(Common.errorResponse("forbidden", "Invalid verification link"));
            if (user.isVerified === true){
                return res.send(Common.errorResponse("forbidden", "Account is already verified"));
            }
            user.isVerified = true;
            Users.updateUser(query, user, {}, function(err, user){
                if (err) {
                    return res.send(Common.errorResponse("badImplementation", err));
                }
                return res.send(Common.createdResponse("Your "+process.env.APP_NAME+" account is sucessfully verified."));
            })
        })
    } else {
          return res.send(Common.errorResponse("badImplementation", 'No token exist'));
    }
}

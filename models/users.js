'use strict';
/**
 * User Model
 **/
 var mongoose = require('mongoose'),
 Schema = mongoose.Schema;
 // moment = require('moment');

 var usersSchema = new Schema({
  firstName   : String,
  lastName    : String,
  fullName    : String,
  userName    : String,
  socialType  : {
    type      : String,
    enum      : ['facebook', 'google', 'normal'],
    default   : 'normal'
  },
  socialId    : String,
  email       : {
    type      : String,
    lowercase : true
  },
  password    : String,
  birthDate   : Number,
  profilePic  : String,
  coverPic    : String,
  alreadyExist: String,
  gender      : {
    type      : String,
    enum      : ['female', 'male', 'other'],
    default   : 'other'
  },
  phoneNumber : {
    countryCode : {type : String},
    countryObj  : {type: String},
    phone       : {type: String}
  },
  otp : Number,
  otpCreatedTime:Date,
  bio : String,
  isVerified  : {
    type : Boolean,
    default : false
  },
  isDeleted   : {type : Boolean, default: false},
  createdAt   : {
    type      : Date,
    default   : Date.now()
  },
  updatedAt   :  {
    type      : Date,
    default   : Date.now()
  },
  token: String
});

/**
* Set Global Virtual Attributes
**/


//phone, coudnty code, shor name, bio,
// usersSchema.virtual('created').get(function(){
//   return moment(this.createdAt.toISOString(), 'YYYY-MM-DDTHH:mm:ss.sssZ').format('MMMM Do YYYY, h:mm a');
// });
//
// usersSchema.virtual('updated').get(function(){
//   return moment(this.updatedAt.toISOString(), 'YYYY-MM-DDTHH:mm:ss.sssZ').format('MMMM Do YYYY, h:mm a');
// });
//
// usersSchema.set('toObject', { virtuals: true });

// usersSchema.virtual('fullName').set(function() {
//    return this.firstName+' '+this.lastName;
// })
//  usersSchema.set('toJSON', { virtuals: true });

/**
* Set Global Methods
**/


module.exports = mongoose.model('users', usersSchema);

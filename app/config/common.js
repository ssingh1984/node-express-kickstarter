var nodemailer = require("nodemailer"),
    crypto = require('crypto'),
    jwt = require('jsonwebtoken'),
    algorithm = 'aes-256-ctr';

var privateKey = process.env.PWD_KEY;



exports.decrypt = function(password) {
    return decrypt(password);
};

exports.encrypt = function(password) {
    return encrypt(password);
};


// method to decrypt data(password)
function decrypt(password) {
    var decipher = crypto.createDecipher(algorithm, privateKey);
    var dec = decipher.update(password, 'hex', 'utf8');
    dec += decipher.final('utf8');
    return dec;
}

// method to encrypt data(password)
function encrypt(password) {
  console.log('password', password);
    var cipher = crypto.createCipher(algorithm, privateKey);
    var crypted = cipher.update(password, 'utf8', 'hex');
    crypted += cipher.final('hex');
    return crypted;
}

exports.randomNumber = function (len) {
    var text = " ";
    var charset = "123456789";
    for( var i=0; i < len; i++ )
        text += charset.charAt(Math.floor(Math.random() * charset.length));
        return text;
};

exports.getToken = function (tokenData) {
    let secretKey = process.env.JWT || 'jwtkey';
    return jwt.sign(tokenData, secretKey, {expiresIn: '18h'});
}
exports.getUserId = function (token) {
    let secretKey = process.env.JWT || 'jwtkey';
    var tokenDecode = jwt.verify(token, secretKey);
    return tokenDecode.id;
}

exports.getJwtDecode = function (token) {
    let secretKey = process.env.JWT || 'jwtkey';
    var tokenDecode = jwt.verify(token, secretKey);
    return tokenDecode;
}

exports.successResponse = function (message, data) {
    return {
        "statusCode": 200,
        "data": data,
        "message": message
    }
}

exports.createdResponse = function (message, data) {
    return {
        "statusCode": 201,
        "data": data,
        "message": message
    }
}

exports.customeResponse = function shorten(arr, obj) {
  var newObj = JSON.parse(JSON.stringify(obj));
    arr.forEach(function(key) {
      delete newObj[key];
    });
    return newObj;
}


exports.errorResponse = function (type, message) {
  switch (type) {
    case 'badRequest':
      return {
        "statusCode": 400,
        "error": "Bad Request",
        "message": message
      }
      break;
    case 'unauthorized':
      return {
        "statusCode": 401,
        "error": "Unauthorized",
        "message": message
      };
      break;
    case 'forbidden':
      return {
          "statusCode": 403,
          "error": "Forbidden",
          "message": message
      };
      break;
    case 'notFound':
      return {
          "statusCode": 404,
          "error": "Not Found",
          "message": message
      };
      break;
    case 'badImplementation':
      return {
          "statusCode": 500,
          "error": "Internal Server Error",
          "message": message
      }
      break;
    default:
  }
}
